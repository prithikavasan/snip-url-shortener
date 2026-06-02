import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <div className="animated-links">
        <span>⌁</span>
        <span>⌁</span>
        <span>⌁</span>
        <span>⌁</span>
        <span>⌁</span>
        <span>⌁</span>
      </div>

      <nav className="home-nav">
        <div className="logo-box">
          <div className="logo-icon">S</div>
          <div>
            <h2>Snip</h2>
            <span>Smart Links</span>
          </div>
        </div>

        <Link to="/login" className="start-btn">
          Start Free
        </Link>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Built for smart link management</span>

          <h1>
            Create short links.
            <br />
            Track every visit.
          </h1>

          <p>
            Snip helps you shorten URLs, generate QR codes, set expiry dates,
            upload links in bulk and understand your audience with analytics.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="hero-btn">
              Get Started
            </Link>
            <Link to="/signup" className="hero-secondary">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <p className="preview-label">Short Link</p>
            <h3>snip.ly/project-demo</h3>
            <div className="preview-line"></div>
            <div className="preview-stats">
              <div>
                <strong>Analytics</strong>
                <span>Real - time</span>
              </div>
              <div>
                <strong>QR Code</strong>
      <span>Available</span>
              </div>
              <div>
                <strong>Custom Alias</strong>
      <span>Supported</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <h2>Powerful Platform</h2>
        <p className="section-subtitle">
          Practical features built for a real full-stack URL shortener.
        </p>

        <div className="platform-grid">
          <div className="platform-card">
            <div className="card-icon blue-icon">01</div>
            <h3>Custom Short Links</h3>
            <p>Create meaningful aliases instead of random unreadable links.</p>
          </div>

          <div className="platform-card">
            <div className="card-icon green-icon">02</div>
            <h3>Analytics Dashboard</h3>
            <p>View clicks, recent visits, browser, device and daily trends.</p>
          </div>

          <div className="platform-card">
            <div className="card-icon purple-icon">03</div>
            <h3>QR & Expiry</h3>
            <p>Generate QR codes and control link availability with expiry dates.</p>
          </div>

          <div className="platform-card">
            <div className="card-icon orange-icon">04</div>
            <h3>Bulk CSV Upload</h3>
            <p>Upload a CSV file and shorten multiple URLs at once.</p>
          </div>
        </div>
      </section>
      <footer className="footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h2>Snip</h2>
      <p>
        Smart URL shortening platform with analytics,
        QR codes, expiry management and bulk URL support.
      </p>
    </div>

    <div className="footer-links">
      <div>
        <h4>Features</h4>
        <a href="#">URL Shortening</a>
        <a href="#">Analytics</a>
        <a href="#">QR Codes</a>
        <a href="#">Bulk Upload</a>
      </div>

      <div>
        <h4>Technology</h4>
        <a href="#">React</a>
        <a href="#">Node.js</a>
        <a href="#">Express</a>
        <a href="#">MongoDB</a>
      </div>

      <div>
        <h4>Project</h4>
        <a href="#">Dashboard</a>
        <a href="#">Public Stats</a>
        <a href="#">Link Management</a>
        <a href="#">Security</a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    © 2026 Snip. Built using React, Node.js, Express and MongoDB.
  </div>
</footer>
    </div>
  );
}

export default Home;