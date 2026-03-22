import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';
import '../styles/landing.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <span className="landing-logo">
          <span className="landing-logo-mark">&lt;/&gt;</span> NxtBuild
        </span>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How it Works</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
        </div>
        <div className="landing-nav-right">
          <button className="landing-nav-login" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="landing-nav-cta" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-badge">AI-Powered App Builder</span>
          <h1 className="landing-hero-title">
            Build Stunning Apps<br />
            <span className="landing-hero-accent">With Plain English</span>
          </h1>
          <p className="landing-hero-subtitle">
            The world's first AI-native web app builder that generates clean, 
            production-ready code. No technical skills required.
          </p>

          <div className="landing-prompt-box">
            <div className="landing-prompt-input">
              "Create a SaaS landing page for a coffee subscription service..."
            </div>
            <button className="landing-prompt-btn" onClick={() => navigate('/login')}>
              Start Building
            </button>
          </div>

          <div className="landing-stats">
            <div className="landing-stat">
              <span className="landing-stat-number">10k+</span>
              <span className="landing-stat-label">Apps Built</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-number">24/7</span>
              <span className="landing-stat-label">AI Generation</span>
            </div>
            <div className="landing-stat">
              <span className="landing-stat-number">0ms</span>
              <span className="landing-stat-label">Zero Latency</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Why NxtBuild?</h2>
          <p className="landing-section-subtitle">A professional platform for professional results.</p>
        </div>
        <div className="landing-features-grid">
          <FeatureCard
            icon="01"
            title="Describe & Generate"
            description="Type what you want to build in plain English. Our AI understands layouts, component logic, and modern design systems."
          />
          <FeatureCard
            icon="02"
            title="Real-time Preview"
            description="See your changes instantly with a built-in live preview. Iteration has never been faster or more intuitive."
          />
          <FeatureCard
            icon="03"
            title="Export Clean Code"
            description="Download production-grade HTML, CSS, and JavaScript. Zero vendor lock-in, deploy anywhere you want."
          />
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-content">
          <span className="landing-logo">
            <span className="landing-logo-mark">&lt;/&gt;</span> NxtBuild
          </span>
          <p className="landing-footer-text">&copy; 2026 NxtBuild AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;