// ─────────────────────────────────────────────────────────────
//  AuthModal — Sign In / Create Account
//  Styled with CSS variables; works across all themes.
// ─────────────────────────────────────────────────────────────

function AuthModal({ onAuthSuccess, onGuestContinue }) {
  const [mode, setMode]         = React.useState('signin');   // 'signin' | 'signup'
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const [error, setError]       = React.useState('');
  const [info, setInfo]         = React.useState('');

  const clearMessages = () => { setError(''); setInfo(''); };

  // Friendly error messages for common Supabase error codes
  function friendlyError(err) {
    if (!err) return 'Something went wrong. Please try again.';
    const msg = err.message || '';
    if (msg.includes('Invalid login credentials'))  return 'Incorrect email or password.';
    if (msg.includes('User already registered'))    return 'An account with this email already exists. Sign in instead.';
    if (msg.includes('Password should be'))         return 'Password must be at least 6 characters.';
    if (msg.includes('Unable to validate email'))   return 'Please enter a valid email address.';
    return msg || 'An unexpected error occurred.';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (mode === 'signup') {
        result = await signUp(email.trim(), password);
        if (!result.error) {
          setInfo('✅ Account created! Check your email to confirm, then sign in.');
          setMode('signin');
          setPassword('');
        }
      } else {
        result = await signIn(email.trim(), password);
        if (!result.error && result.user) {
          onAuthSuccess(result.user);
        }
      }
      if (result.error) setError(friendlyError(result.error));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-label="Authentication">
      <div className="auth-modal">

        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-logo">☁️</div>
          <h2 className="auth-modal-title">CloudFolio</h2>
          <p className="auth-modal-subtitle">
            {mode === 'signin'
              ? 'Sign in to sync your resume to the cloud'
              : 'Create an account for free cloud resume storage'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'signin'}
            className={`auth-tab-btn${mode === 'signin' ? ' active' : ''}`}
            onClick={() => { setMode('signin'); clearMessages(); }}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab-btn${mode === 'signup' ? ' active' : ''}`}
            onClick={() => { setMode('signup'); clearMessages(); }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="auth-message auth-error" role="alert">
              ⚠️ {error}
            </div>
          )}
          {info && (
            <div className="auth-message auth-info" role="status">
              {info}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? <span className="auth-spinner" aria-hidden="true" />
              : null}
            {loading
              ? (mode === 'signup' ? 'Creating account…' : 'Signing in…')
              : (mode === 'signup' ? '🚀 Create Account' : '🔐 Sign In')}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Guest option */}
        <button
          className="btn btn-secondary auth-guest-btn"
          onClick={onGuestContinue}
          disabled={loading}
        >
          Continue as Guest <span style={{ opacity: 0.6, fontSize: '0.8em' }}>(saves locally only)</span>
        </button>

        {/* Footer note */}
        <p className="auth-footer-note">
          🔒 Secured by Supabase · Your data is private and encrypted
        </p>
      </div>
    </div>
  );
}
