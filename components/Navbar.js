function Navbar({
  activeTheme,
  onThemeChange,
  onDownloadPDF,
  onShareQR,
  analyticsData
}) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-icon">☁️</div>
        <div>
          <h1 className="nav-title">Cloud Resume & Portfolio</h1>
          <p className="nav-subtitle">Serverless Cloud Hosting & Resume Builder</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Analytics Counter Badge */}
        <div className="analytics-badge" title="Serverless & Session Analytics Counter">
          <span className="pulse-dot"></span>
          <span>👁️ {analyticsData.views} Views</span>
          <span>•</span>
          <span>📥 {analyticsData.downloads} Downloads</span>
        </div>

        {/* Theme Switcher */}
        <div className="theme-selector">
          <span>🎨</span>
          <select
            className="theme-select-input"
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
          >
            <option value="dark-glass">Dark Glass</option>
            <option value="corporate-minimal">Corporate Light</option>
            <option value="cyber-neon">Cyber Neon</option>
          </select>
        </div>

        {/* Share QR Button */}
        <button className="btn btn-secondary" onClick={onShareQR} title="Generate Share Link & QR Code">
          🔗 Share / QR
        </button>

        {/* Download PDF Button */}
        <button className="btn btn-primary" onClick={onDownloadPDF} title="Export Print-Ready PDF Resume">
          📄 Download PDF
        </button>
      </div>
    </header>
  );
}
