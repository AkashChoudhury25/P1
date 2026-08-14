// ─────────────────────────────────────────────────────────────
//  ResumePickerModal
//  Shown after sign-in: list all resumes, create new, delete.
// ─────────────────────────────────────────────────────────────

function ResumePickerModal({ resumes, onSelect, onCreate, onDelete, userEmail, onSignOut }) {
  const [creating,    setCreating]    = React.useState(resumes.length === 0); // auto-open if no resumes
  const [newName,     setNewName]     = React.useState('');
  const [nameError,   setNameError]   = React.useState('');
  const [deletingId,  setDeletingId]  = React.useState(null);
  const [loading,     setLoading]     = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (creating && inputRef.current) inputRef.current.focus();
  }, [creating]);

  async function handleCreate(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) { setNameError('Please enter a resume name.'); return; }
    if (name.length > 60) { setNameError('Name must be 60 characters or fewer.'); return; }
    setLoading(true);
    setNameError('');
    try {
      const result = await onCreate(name);
      if (!result || result.ok === false) {
        // Keep the form open, show the real reason so this is diagnosable
        setNameError(result?.message || 'Could not create resume. Please check your connection and try again.');
      } else {
        // Success — form will close as picker hides
        setNewName('');
        setCreating(false);
      }
    } catch (err) {
      setNameError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (_) { return ''; }
  }

  return (
    <div className="rp-overlay" role="dialog" aria-modal="true" aria-label="Your Resumes">
      <div className="rp-modal">

        {/* Header */}
        <div className="rp-header">
          <div>
            <div className="rp-logo">☁️</div>
            <h2 className="rp-title">My Resumes</h2>
            <p className="rp-subtitle">{userEmail}</p>
          </div>
          <button className="rp-signout-btn" onClick={onSignOut} title="Sign out">
            Sign out ↩
          </button>
        </div>

        {/* Resume list */}
        {resumes.length > 0 && (
          <div className="rp-grid">
            {resumes.map(r => (
              <div
                key={r.id}
                className={`rp-card${deletingId === r.id ? ' rp-card--deleting' : ''}`}
                onClick={() => onSelect(r.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelect(r.id)}
                aria-label={`Open resume: ${r.name}`}
              >
                <div className="rp-card-icon">📄</div>
                <div className="rp-card-body">
                  <div className="rp-card-name">{r.name}</div>
                  <div className="rp-card-date">
                    {r.updated_at ? `Saved ${formatDate(r.updated_at)}` : 'Not saved yet'}
                  </div>
                </div>
                <button
                  className="rp-delete-btn"
                  onClick={e => handleDelete(e, r.id)}
                  title="Delete this resume"
                  aria-label={`Delete ${r.name}`}
                  disabled={deletingId === r.id}
                >
                  {deletingId === r.id ? '…' : '🗑'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {resumes.length === 0 && !creating && (
          <div className="rp-empty">
            <div style={{ fontSize: '3rem' }}>📋</div>
            <p>You don't have any resumes yet.</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Create your first one below.</p>
          </div>
        )}

        {/* Create new resume form */}
        {creating ? (
          <form className="rp-create-form" onSubmit={handleCreate} noValidate>
            <h3 className="rp-create-title">
              {resumes.length === 0 ? '✨ Name your first resume' : '✨ New Resume'}
            </h3>
            <p className="rp-create-hint">
              Give it a name like "Software Engineer — Google" or "Full Stack Resume v2"
            </p>
            {nameError && <div className="auth-message auth-error">{nameError}</div>}
            <input
              ref={inputRef}
              type="text"
              placeholder='e.g. "Software Engineer Resume"'
              value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(''); }}
              disabled={loading}
              maxLength={60}
              style={{ width: '100%' }}
            />
            <div className="rp-create-actions">
              <button type="submit" className="btn btn-primary" disabled={loading || !newName.trim()}>
                {loading
                  ? <><span className="auth-spinner" />Creating…</>
                  : '🚀 Create Resume'}
              </button>
              {resumes.length > 0 && (
                <button type="button" className="btn btn-secondary" onClick={() => { setCreating(false); setNameError(''); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <button
            className="rp-add-btn"
            onClick={() => { setCreating(true); setNewName(''); }}
          >
            <span style={{ fontSize: '1.3rem' }}>＋</span>
            <span>New Resume</span>
          </button>
        )}
      </div>
    </div>
  );
}
