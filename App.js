// ─────────────────────────────────────────────────────────────
//  CloudFolio — Root Application Controller
//  Multi-resume: each user owns N resumes, picked from a modal.
// ─────────────────────────────────────────────────────────────

function App() {
  // ── Auth ────────────────────────────────────────────────────
  const [currentUser,    setCurrentUser]    = React.useState(null);
  const [authChecked,    setAuthChecked]    = React.useState(false);
  const [showAuthModal,  setShowAuthModal]  = React.useState(false);
  const [isGuest,        setIsGuest]        = React.useState(false);

  // ── Multi-resume ────────────────────────────────────────────
  const [userResumes,     setUserResumes]    = React.useState([]);   // [{id,name,updated_at}]
  const [activeResumeId,  setActiveResumeId] = React.useState(null);
  const [activeResumeName,setActiveResumeName]= React.useState('');
  const [showPicker,      setShowPicker]     = React.useState(false);

  // ── Resume data + UI ────────────────────────────────────────
  const [resumeData,    setResumeData]    = React.useState(blankResumeData);
  const [activeTheme,   setActiveTheme]   = React.useState('dark-glass');
  const [viewMode,      setViewMode]      = React.useState('resume');
  const [printConfig,   setPrintConfig]   = React.useState({ fontSize: '11pt', margin: '15mm' });
  const [analyticsData, setAnalyticsData] = React.useState(getCloudAnalytics());
  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);
  const [toasts,        setToasts]        = React.useState([]);
  const [saveStatus,    setSaveStatus]    = React.useState('');

  // Auto-save debounce ref
  const saveTimer = React.useRef(null);
  // Tracks which user ID we already launched the picker for
  // Prevents token-refresh SIGNED_IN events from re-opening the picker
  const pickerLaunchedForRef = React.useRef(null);
  const prevUserIdRef = React.useRef(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // ── Auth init ───────────────────────────────────────────────
  React.useEffect(() => {
    let unsubscribe = () => {};

    async function initAuth() {
      try {
        const sessionResult = await getCurrentSession();
        const user = sessionResult?.data?.session?.user || null;

        if (user) {
          setCurrentUser(user);
          await openPickerForUser(user);
        } else {
          const guestChosen = localStorage.getItem('cloudfolio_guest_mode') === 'true';
          if (guestChosen) {
            setIsGuest(true);
            const draft = loadResumeDraft();
            if (draft && draft.personal) setResumeData(draft);
          } else {
            setShowAuthModal(true);
          }
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
        setShowAuthModal(true);
      } finally {
        setAuthChecked(true);
        setAnalyticsData(incrementAnalytics('views'));
      }
    }

    initAuth();

    unsubscribe = onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      const prevUserId = prevUserIdRef.current;
      prevUserIdRef.current = user?.id || null;

      setCurrentUser(user);

      if (event === 'SIGNED_IN' && user && !prevUserId) {
        // Only a truly NEW sign-in (not token refresh — which also fires SIGNED_IN)
        // prevUserId is null means no user was signed in before this event
        localStorage.removeItem('cloudfolio_guest_mode');
        setIsGuest(false);
        setShowAuthModal(false);
        await openPickerForUser(user);
        addToast('🟢 Signed in successfully!');
      } else if (event === 'SIGNED_OUT') {
        pickerLaunchedForRef.current = null;
        prevUserIdRef.current = null;
        setCurrentUser(null);
        setUserResumes([]);
        setActiveResumeId(null);
        setActiveResumeName('');
        setShowPicker(false);
        setShowAuthModal(false);
        setIsGuest(false);
        localStorage.removeItem('cloudfolio_resume_draft_v2');
        localStorage.removeItem('cloudfolio_guest_mode');
        setResumeData(blankResumeData);
        setActiveTheme('dark-glass');
        addToast('👋 Signed out. Starting fresh session.');
      }
    });

    return unsubscribe;
  }, []);

  /** Fetch resumes and show picker — guarded so it only fires once per user session. */
  async function openPickerForUser(user) {
    if (!user) return;
    if (pickerLaunchedForRef.current === user.id) return; // already launched
    pickerLaunchedForRef.current = user.id;
    prevUserIdRef.current = user.id;
    const { resumes, error } = await getUserResumes();
    setUserResumes(resumes);
    setShowPicker(true);
    if (error) {
      addToast(`⚠️ Couldn't load your resumes from the cloud: ${error}`);
    }
  }

  /** User selected a resume from the picker. */
  async function handleSelectResume(id) {
    setSaveStatus('Loading…');
    const result = await loadResume(id);
    if (result) {
      const data = result.resumeData;
      const validData = (data && data.personal) ? data : blankResumeData;
      setResumeData(validData);
      if (validData.activeTheme) setActiveTheme(validData.activeTheme);
      setActiveResumeId(id);
      setActiveResumeName(result.name || 'Resume');
    }
    setShowPicker(false);
    setSaveStatus('');
  }

  /** User created a new resume from the picker. */
  async function handleCreateResume(name) {
    const { id, error } = await createResume(name);
    if (!id) {
      const message = error || 'Unknown error — check your connection and try again.';
      addToast(`❌ Couldn't create resume: ${message}`);
      return { ok: false, message }; // signal failure + real reason to the picker
    }
    setActiveResumeId(id);
    setActiveResumeName(name);
    setResumeData(blankResumeData);
    setActiveTheme('dark-glass');
    setShowPicker(false);
    addToast(`✅ Resume “${name}” created!`);
    return { ok: true }; // signal success
  }

  /** User deleted a resume from the picker. */
  async function handleDeleteResume(id) {
    const { success, error } = await deleteResume(id);
    if (!success) {
      addToast(`❌ Couldn't delete resume: ${error || 'unknown error, try again.'}`);
      return;
    }
    setUserResumes(prev => prev.filter(r => r.id !== id));
    // If they deleted the resume they currently have open, clear it out
    // so they don't keep editing (and re-saving) a resume that no longer exists.
    if (id === activeResumeId) {
      setActiveResumeId(null);
      setActiveResumeName('');
      setResumeData(blankResumeData);
    }
    addToast('🗑 Resume deleted.');
  }

  // ── Resume change handler (auto-save) ───────────────────────
  const handleResumeDataChange = (newData) => {
    setResumeData(newData);
    setSaveStatus('Saving…');

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const result = await saveResume(activeResumeId, newData);
      if (result.source === 'cloud') {
        setSaveStatus('✓ Saved to cloud');
        // Refresh resume list timestamps
        setUserResumes(prev => prev.map(r =>
          r.id === activeResumeId
            ? { ...r, updated_at: new Date().toISOString() }
            : r
        ));
      } else {
        setSaveStatus('✓ Saved locally');
      }
      setTimeout(() => setSaveStatus(''), 2500);
    }, 800);
  };

  /** Explicit Save button */
  const handleExplicitSave = async () => {
    setSaveStatus('Saving…');
    const result = await saveResume(activeResumeId, resumeData);
    setSaveStatus(result.source === 'cloud' ? '✓ Saved to cloud' : '✓ Saved locally');
    setTimeout(() => setSaveStatus(''), 2500);
    addToast('💾 Resume saved!');
  };

  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    handleResumeDataChange({ ...resumeData, activeTheme: newTheme });
  };

  const handleDownloadPDF = () => {
    setAnalyticsData(incrementAnalytics('downloads'));
    addToast('📄 Generating PDF…');
    setTimeout(() => window.print(), 300);
  };

  // ── Auth actions ────────────────────────────────────────────
  const handleAuthSuccess  = () => setShowAuthModal(false);
  const handleGuestContinue = () => {
    localStorage.setItem('cloudfolio_guest_mode', 'true');
    setIsGuest(true);
    setShowAuthModal(false);
    setResumeData(blankResumeData);
    addToast('👤 Continuing as guest — data saved locally only.');
  };
  const handleSignOut = async () => { await signOut(); };
  const handleShowAuth = () => setShowAuthModal(true);

  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const shareUrl = window.location.href;

  // ── Loading splash ──────────────────────────────────────────
  if (!authChecked) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: '1rem',
        background: 'var(--bg-primary)', color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '2.5rem' }}>☁️</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Connecting to cloud…</p>
      </div>
    );
  }

  return (
    <div className="app-main-wrapper">

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onAuthSuccess={handleAuthSuccess} onGuestContinue={handleGuestContinue} />
      )}

      {/* Resume Picker */}
      {showPicker && currentUser && (
        <ResumePickerModal
          resumes={userResumes}
          userEmail={currentUser.email}
          onSelect={handleSelectResume}
          onCreate={handleCreateResume}
          onDelete={handleDeleteResume}
          onSignOut={handleSignOut}
        />
      )}

      {/* Navbar */}
      <Navbar
        activeTheme={activeTheme}
        onThemeChange={handleThemeChange}
        onDownloadPDF={handleDownloadPDF}
        onShareQR={() => setIsQRModalOpen(true)}
        analyticsData={analyticsData}
        currentUser={currentUser}
        isGuest={isGuest}
        onSignOut={handleSignOut}
        onSignIn={handleShowAuth}
        saveStatus={saveStatus}
        activeResumeName={activeResumeName}
        onOpenPicker={() => { setShowPicker(true); }}
        onSave={activeResumeId ? handleExplicitSave : null}
      />

      {/* Main Split View */}
      <main className="app-container">
        <FormBuilder
          resumeData={resumeData}
          onChange={handleResumeDataChange}
          onToast={addToast}
        />

        <section className="preview-panel">
          <div className="preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Live Preview</span>
              <span className="skill-tag" style={{ fontSize: '0.7rem' }}>
                {viewMode === 'resume' ? 'A4 Document Mode' : 'Web Portfolio Mode'}
              </span>
            </div>

            {viewMode === 'resume' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-input)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Format:</span>
                <select value={printConfig.fontSize} onChange={e => setPrintConfig({ ...printConfig, fontSize: e.target.value })} className="theme-select-input">
                  <option value="10pt">10pt Font</option>
                  <option value="11pt">11pt Font</option>
                  <option value="12pt">12pt Font</option>
                </select>
                <select value={printConfig.margin} onChange={e => setPrintConfig({ ...printConfig, margin: e.target.value })} className="theme-select-input">
                  <option value="10mm">Narrow Margins</option>
                  <option value="15mm">Normal Margins</option>
                  <option value="20mm">Wide Margins</option>
                </select>
              </div>
            )}

            <div className="view-mode-toggle">
              <button className={`view-mode-btn ${viewMode === 'resume' ? 'active' : ''}`} onClick={() => setViewMode('resume')}>
                📄 Resume View
              </button>
              <button className={`view-mode-btn ${viewMode === 'portfolio' ? 'active' : ''}`} onClick={() => setViewMode('portfolio')}>
                🌐 Web Portfolio View
              </button>
            </div>
          </div>

          {viewMode === 'resume'
            ? <ResumePreview resumeData={resumeData} printConfig={printConfig} />
            : <PortfolioView resumeData={resumeData} />}
        </section>
      </main>

      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} shareUrl={shareUrl} onToast={addToast} />

      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="toast" role="status"><span>{t.message}</span></div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
