function QRCodeModal({ isOpen, onClose, shareUrl, onToast }) {
  if (!isOpen) return null;

  const qrImageApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}&color=0b0f19&bgcolor=ffffff`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    onToast('📋 Live Portfolio URL copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.3rem' }}>☁️ Cloud Portfolio Share Link</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Scan the QR Code or copy the hosted URL below to view this portfolio on any mobile device or recruiter screen.
        </p>

        <div className="qr-box">
          <img src={qrImageApi} alt="Portfolio QR Code" width="180" height="180" />
        </div>

        <div className="form-group" style={{ width: '100%' }}>
          <input type="text" readOnly value={shareUrl} style={{ textAlign: 'center', fontSize: '0.82rem' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button className="btn btn-primary" onClick={copyToClipboard} style={{ flex: 1, justifyContent: 'center' }}>
            📋 Copy Link
          </button>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
