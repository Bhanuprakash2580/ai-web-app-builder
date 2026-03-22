import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { register, emailLogin } from '../services/authService.js';
import '../styles/login.css';

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) { showToast('Please fill in all fields.', 'error'); return; }
    if (isSignUp && !name) { showToast('Please enter your name.', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

    setLoading(true);
    try {
      const result = isSignUp
        ? await register(name, email, password)
        : await emailLogin(email, password);

      login(result.token, result.user);
      showToast(
        isSignUp ? `Welcome, ${result.user.name}!` : `Welcome back, ${result.user.name}!`,
        'success'
      );
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setName(''); setEmail(''); setPassword('');
  };

  return (
    <div className="login-page">
      {/* Left animated gradient panel */}
      <div className="login-left-panel">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-left-content">
          <div className="login-left-brand">
            <span className="login-left-brand-mark">&lt;/&gt;</span>
            NxtBuild
          </div>
          <h2 className="login-left-tagline">
            Build web apps with the power of AI
          </h2>
          <p className="login-left-sub">
            Describe your idea in plain English and watch it become a real, working app in seconds.
          </p>
          <div className="login-features">
            <div className="login-feature-item">
              <span className="login-feature-icon">⚡</span>
              <span className="login-feature-text">Instant code generation from natural language</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-icon">🎨</span>
              <span className="login-feature-text">Beautiful, production-ready HTML & CSS</span>
            </div>
            <div className="login-feature-item">
              <span className="login-feature-icon">📦</span>
              <span className="login-feature-text">Download and deploy anywhere, instantly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right-panel">
        <div className="login-card">
          <div className="login-card-logo">
            <span className="login-card-logo-mark">&lt;/&gt;</span>
            NxtBuild
          </div>

          <h2 className="login-card-title">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="login-card-subtitle">
            {isSignUp ? 'Start building web apps with AI' : 'Sign in to continue building'}
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="login-field-group">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="login-field-group">
              <label className="login-label">Email Address</label>
              <input
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login-field-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading
                ? 'Authenticating...'
                : isSignUp
                  ? 'Create My Account'
                  : 'Sign In to Workspace'}
            </button>
          </form>

          <p className="login-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="login-toggle-btn" onClick={handleToggle}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;