
import { Link } from "react-router-dom";
import {
  Recycle,
  ArrowRight,
  Smartphone,
  BrainCircuit,
  MapPin,
  Leaf
} from "lucide-react";

function Landing() {
  return (
    <div className="landing">

      <nav className="navbar">
        <Link to="/" className="logo">
          <Recycle size={28} />
          EcoLoop AI
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">

          <span className="tagline">
            <Leaf size={16} /> Smart E-waste Recovery
          </span>

          <h1>
            Don't Waste It.
            <br />
            <span>Recover Its Value.</span>
          </h1>

          <p>
            Give your old electronics a second life.
            Use AI to discover whether your device
            should be repaired, reused, resold or recycled.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-button">
              Get Started <ArrowRight size={18} />
            </Link>

            <a href="#features" className="secondary-button">
              Explore Features
            </a>
          </div>

        </div>

        <div className="hero-visual">
          <div className="visual-icon">
            <Recycle size={100} />
          </div>
          <h3>Every Device Has Value</h3>
          <p>Recover. Reuse. Recycle.</p>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Intelligent Recovery Solutions</h2>
        <p className="section-description">
          Technology that makes responsible
          e-waste management easier.
        </p>

        <div className="feature-grid">

          <div className="feature-card">
            <Smartphone size={32} />
            <h3>Smart Identification</h3>
            <p>
              Identify electronic devices using
              AI-powered image classification.
            </p>
          </div>

          <div className="feature-card">
            <BrainCircuit size={32} />
            <h3>AI Recovery Intelligence</h3>
            <p>
              Estimate device value and discover
              the best recovery pathway.
            </p>
          </div>

          <div className="feature-card">
            <MapPin size={32} />
            <h3>Nearby Recovery Centres</h3>
            <p>
              Find repair shops and responsible
              recycling facilities.
            </p>
          </div>

        </div>
      </section>

      <footer className="footer">
        <h3>EcoLoop AI</h3>
        <p>Give Every Electronic Device a Second Life.</p>
        <p>© 2026 EcoLoop AI. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Landing;
