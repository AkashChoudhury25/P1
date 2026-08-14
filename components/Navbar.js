// ─────────────────────────────────────────────────────────────
//  CloudFolio Navbar — multi-resume aware
// ─────────────────────────────────────────────────────────────

function Navbar({
  activeTheme, onThemeChange,
  onDownloadPDF, onShareQR,
  analyticsData,
  currentUser, isGuest,
  onSignOut, onSignIn,
  saveStatus,
  activeResumeName,
  onOpenPicker,
  onSave,
}) {
  const [themeOpen, setThemeOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setThemeOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'dark-glass',        label: '🌙 Ink & Paper' },
    { value: 'corporate-minimal', label: '☀️ Daylight Desk' },
    { value: 'cyber-neon',        label: '⚡ Night Terminal' },
  ];
  const activeLabel = themes.find(t => t.value === activeTheme)?.label || '🎨 Theme';

  const isLive = Boolean(currentUser);
  const userInitials = currentUser?.email ? currentUser.email.slice(0, 2).toUpperCase() : 'G';

  return (
    <header className="navbar">
      {/* Brand */}
      <div className="nav-brand">
        <div className="nav-logo-icon" aria-hidden="true">☁️</div>
        <div>
          <h1 className="nav-title">Cloud Resume &amp; Portfolio</h1>
          <p className="nav-subtitle">Serverless Cloud Hosting &amp; Resume Builder</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Session stamp */}
        {isLive ? (
          <span className="pf-stamp pf-stamp--live" title={`Signed in as ${currentUser.email}`}>
            <span className="pf-stamp-dot" aria-hidden="true"></span>
            Live Session
          </span>
        ) : (
          <span className="pf-stamp pf-stamp--local">
            <span className="pf-stamp-dot" style={{ background: 'var(--text-muted)', boxShadow: 'none' }} aria-hidden="true"></span>
            Local Session
          </span>
        )}

        {/* Active resume name + My Resumes button */}
        {isLive && activeResumeName && (
          <button
            className="nav-resume-chip"
            onClick={onOpenPicker}
            title="Switch resume"
          >
            <span className="nav-resume-name">📄 {activeResumeName}</span>
            <span style={{ opacity: 0.55, fontSize: '0.7rem' }}>▼</span>
          </button>
        )}

        {/* Save status */}
        {saveStatus && (
          <span style={{
            fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600,
            color: saveStatus.includes('cloud') ? 'var(--cloud-color)' : 'var(--text-muted)',
          }}>
            {saveStatus}
          </span>
        )}

        {/* Analytics */}
        <div className="analytics-badge" title="Session analytics">
          <span className="pulse-dot" aria-hidden="true"></span>
          <span>👁️ {analyticsData.views} Views</span>
          <span aria-hidden="true">•</span>
          <span>📥 {analyticsData.downloads} Downloads</span>
        </div>

        {/* Theme Switcher */}
        <div className="theme-selector" ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="theme-dropdown-btn"
            onClick={() => setThemeOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={themeOpen}
          >
            🎨 {activeLabel}
            <span style={{ fontSize: '0.65rem', opacity: 0.7, marginLeft: '2px' }}>▼</span>
          </button>
          {themeOpen && (
            <ul className="theme-dropdown-menu" role="listbox">
              {themes.map(t => (
                <li
                  key={t.value}
                  role="option"
                  aria-selected={activeTheme === t.value}
                  className={`theme-dropdown-item${activeTheme === t.value ? ' active' : ''}`}
                  onClick={() => { onThemeChange(t.value); setThemeOpen(false); }}
                >
                  {t.label}
                  {activeTheme === t.value && <span style={{ marginLeft: 'auto' }}>✓</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Explicit Save button (only when a resume is open) */}
        {onSave && (
          <button className="btn btn-accent" onClick={onSave} title="Save resume now">
            💾 Save
          </button>
        )}

        {/* My Resumes (signed in) */}
        {isLive && (
          <button className="btn btn-secondary" onClick={onOpenPicker} title="Manage your resumes">
            📂 My Resumes
          </button>
        )}

        {/* Share QR */}
        <button className="btn btn-secondary" onClick={onShareQR}>🔗 Share / QR</button>

        {/* Download PDF */}
        <button className="btn btn-primary" onClick={onDownloadPDF}>📄 Download PDF</button>

        {/* User chip or Sign In */}
        {isLive ? (
          <div className="auth-user-chip" title={currentUser.email}>
            <div className="auth-user-avatar">{userInitials}</div>
            <span className="auth-user-email">{currentUser.email}</span>
            <button className="auth-signout-btn" onClick={onSignOut} title="Sign out" aria-label="Sign out">↩</button>
          </div>
        ) : (
          <button className="btn btn-accent" onClick={onSignIn}>🔐 Sign In</button>
        )}
      </div>
    </header>
  );
}
