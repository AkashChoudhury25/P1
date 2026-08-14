function Navbar({
  activeTheme,
  onThemeChange,
  onDownloadPDF,
  onShareQR,
  analyticsData
}) {
  // Cloud sync status drives the postmark stamp — tells the user plainly
  // whether their analytics are stored locally or synced to a database.
  const isSynced = (analyticsData.cloudStatus || '').toLowerCase().includes('connected');
  const stampLabel = isSynced ? 'Synced to cloud' : 'Local session';

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-icon" aria-hidden="true">☁️</div>
        <div>
          <h1 className="nav-title">Cloud Resume & Portfolio</h1>
          <p className="nav-subtitle">Serverless Cloud Hosting &amp; Resume Builder</p>
        </div>
      </div>

      <div className="nav-actions">
        {/* Cloud Sync Status Stamp */}
        <span
          className={`pf-stamp ${isSynced ? 'pf-stamp--live' : 'pf-stamp--local'}`}
          title={analyticsData.cloudStatus || stampLabel}
        >
          <span className="pf-stamp-dot" aria-hidden="true"></span>
          {stampLabel}
        </span>

        {/* Analytics Counter Badge */}
        <div className="analytics-badge" title="Session view and download counter">
          <span className="pulse-dot" aria-hidden="true"></span>
          <span>👁️ {analyticsData.views} Views</span>
          <span aria-hidden="true">•</span>
          <span>📥 {analyticsData.downloads} Downloads</span>
        </div>

        {/* Theme Switcher */}
        <div className="theme-selector">
          <span aria-hidden="true">🎨</span>
          <label className="sr-only" htmlFor="theme-select">Choose a visual theme</label>
          <select
            id="theme-select"
            className="theme-select-input"
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
          >
            <option value="dark-glass">Ink &amp; Paper</option>
            <option value="corporate-minimal">Daylight Desk</option>
            <option value="cyber-neon">Night Terminal</option>
          </select>
        </div>

        {/* Share QR Button */}
        <button className="btn btn-secondary" onClick={onShareQR} title="Generate a share link and QR code">
          🔗 Share / QR
        </button>

        {/* Download PDF Button */}
        <button className="btn btn-primary" onClick={onDownloadPDF} title="Export a print-ready PDF resume">
          📄 Download PDF
        </button>
      </div>
    </header>
  );
}
