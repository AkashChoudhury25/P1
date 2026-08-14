function App() {
  // Load saved draft or fall back to rich sample data
  const [resumeData, setResumeData] = React.useState(() => {
    const saved = loadResumeDraft();
    return saved || initialResumeData;
  });

  const [activeTheme, setActiveTheme] = React.useState(resumeData.activeTheme || 'dark-glass');
  const [viewMode, setViewMode] = React.useState('resume'); // 'resume' | 'portfolio'
  const [printConfig, setPrintConfig] = React.useState({ fontSize: '11pt', margin: '15mm' });
  const [analyticsData, setAnalyticsData] = React.useState(getCloudAnalytics());
  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);

  // Apply theme to document root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Track initial page view analytics on mount
  React.useEffect(() => {
    const updated = incrementAnalytics('views');
    setAnalyticsData(updated);
  }, []);

  // Save resume state changes automatically to LocalStorage draft
  const handleResumeDataChange = (newData) => {
    setResumeData(newData);
    saveResumeDraft(newData);
  };

  // Toast Notification Helper
  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Handle Theme Change
  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    handleResumeDataChange({ ...resumeData, activeTheme: newTheme });
    addToast(`🎨 Theme switched to ${newTheme.replace('-', ' ').toUpperCase()}`);
  };

  // Handle Download PDF
  const handleDownloadPDF = () => {
    const updated = incrementAnalytics('downloads');
    setAnalyticsData(updated);
    addToast('📄 Generating Print-Ready PDF Resume...');
    
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const shareUrl = window.location.href;

  return (
    <div className="app-main-wrapper">
      {/* Top Navbar */}
      <Navbar
        activeTheme={activeTheme}
        onThemeChange={handleThemeChange}
        onDownloadPDF={handleDownloadPDF}
        onShareQR={() => setIsQRModalOpen(true)}
        analyticsData={analyticsData}
      />

      {/* Main Split View Container */}
      <main className="app-container">
        {/* Left Side: Dynamic Form Builder */}
        <FormBuilder
          resumeData={resumeData}
          onChange={handleResumeDataChange}
          onToast={addToast}
        />

        {/* Right Side: Live Visual Preview */}
        <section className="preview-panel">
          <div className="preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Live Preview</span>
              <span className="skill-tag" style={{ fontSize: '0.7rem' }}>
                {viewMode === 'resume' ? 'A4 Document Mode' : 'Web Portfolio Mode'}
              </span>
            </div>

            {/* Print Layout Customizer (Phase 3) */}
            {viewMode === 'resume' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-input)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Format:</span>
                <select 
                  value={printConfig.fontSize} 
                  onChange={(e) => setPrintConfig({...printConfig, fontSize: e.target.value})}
                  className="theme-select-input"
                >
                  <option value="10pt">10pt Font</option>
                  <option value="11pt">11pt Font</option>
                  <option value="12pt">12pt Font</option>
                </select>
                <select 
                  value={printConfig.margin} 
                  onChange={(e) => setPrintConfig({...printConfig, margin: e.target.value})}
                  className="theme-select-input"
                >
                  <option value="10mm">Narrow Margins</option>
                  <option value="15mm">Normal Margins</option>
                  <option value="20mm">Wide Margins</option>
                </select>
              </div>
            )}

            {/* Dual View Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'resume' ? 'active' : ''}`}
                onClick={() => setViewMode('resume')}
              >
                📄 Resume View
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'portfolio' ? 'active' : ''}`}
                onClick={() => setViewMode('portfolio')}
              >
                🌐 Web Portfolio View
              </button>
            </div>
          </div>

          {/* Render Active Mode */}
          {viewMode === 'resume' ? (
            <ResumePreview resumeData={resumeData} printConfig={printConfig} />
          ) : (
            <PortfolioView resumeData={resumeData} />
          )}
        </section>
      </main>

      {/* Share QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shareUrl={shareUrl}
        onToast={addToast}
      />

      {/* Toast Notification Container */}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="status">
            <span aria-hidden="true">ℹ️</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
