function App() {
  // Load saved draft or fall back to rich sample data
  const [resumeData, setResumeData] = React.useState(() => {
    const saved = loadResumeDraft();
    return saved || initialResumeData;
  });

  const [activeTheme, setActiveTheme] = React.useState(resumeData.activeTheme || 'dark-glass');
  const [viewMode, setViewMode] = React.useState('resume'); // 'resume' | 'portfolio'
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
            <ResumePreview resumeData={resumeData} />
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
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span>ℹ️</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
