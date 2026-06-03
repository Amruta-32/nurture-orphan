import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/or1.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Scroll reveal animation
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const reveal = () => {
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('revealed');
        }
      });
    };
    window.addEventListener('scroll', reveal);
    reveal();
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="fas fa-hand-holding-heart"></i> NurtureOrphan
          </div>
          <div className="nav-links">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#programs">Education</a>
            <a href="#stories">Stories</a>
            <a href="#impact">Get Involved</a>
            <a href="#about">About</a>
            <a href="#" className="donate-btn-nav" onClick={(e) => { e.preventDefault(); navigate('/donation'); }}>Donate</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
          </div>
          <div className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        <div className={`mobile-nav-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobile(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
          <a href="#programs" onClick={closeMobile}>Education</a>
          <a href="#stories" onClick={closeMobile}>Stories</a>
          <a href="#impact" onClick={closeMobile}>Get Involved</a>
          <a href="#about" onClick={closeMobile}>About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); closeMobile(); navigate('/login'); }}>Login</a>
          <a href="#" className="mobile-donate-btn" onClick={(e) => { e.preventDefault(); closeMobile(); navigate('/signup-choice'); }}>
            <i className="fas fa-hand-holding-heart"></i> Sign Up / Donate
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-overlay"></div>
        <div className="hero-pattern"></div>
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-overline">
              <i className="fas fa-heartbeat"></i> Compassion in action
            </div>
            <h1>MAKE A <span>DIFFERENCE</span><br />in the lives of orphan children worldwide.</h1>
            <p>Join us as we work to provide hope, relief, and change. Every child deserves a loving family, education, and a future full of possibilities.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/signup-choice')}>
                <i className="fas fa-hand-holding-heart"></i> Help Orphan
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
            </div>
  
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
          </svg>
        </div>
      </section>

      {/* Education & Care Programs */}
      <div className="section section-light" id="programs">
        <div className="container">
          <h2 className="section-title scroll-reveal">Our <span>Education & Care</span> Programs</h2>
          <p className="section-sub scroll-reveal">Every child deserves to learn, grow, and thrive in a nurturing environment.</p>
          <div className="program-grid">
            {[
              { icon: "graduation-cap", title: "Education Access", desc: "School fees, books, uniforms, and tutoring to unlock potential." },
              { icon: "apple-alt", title: "Nutrition & Care", desc: "Daily nutritious meals, vitamins, and medical checkups." },
              { icon: "home", title: "Safe Shelter", desc: "Family-style orphanages with warmth and security." },
              { icon: "hands", title: "Emotional Support", desc: "Counseling, mentorship, and trauma healing." }
            ].map((p, i) => (
              <div className="program-card scroll-reveal" key={i}>
                <div className="icon-circle"><i className={`fas fa-${p.icon}`}></i></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stories of Hope */}
      <div className="section story-section" id="stories">
        <div className="container">
          <h2 className="section-title scroll-reveal"><i className="fas fa-book-open"></i> Stories of Hope</h2>
          <p className="section-sub scroll-reveal">Real children, real transformation — because of generous hearts like you.</p>
          <div className="stories-grid">
            {[
              { emoji: "🌟", title: "Maya's Journey · Uganda", text: '"After losing her parents, Maya found hope through our program. Now she\'s top of her class."' },
              { emoji: "🏠", title: "Elias' New Family · Brazil", text: '"Elias was adopted into a loving foster home. He now enjoys painting and playing soccer."' },
              { emoji: "💪", title: "Sofia's Strength · Philippines", text: '"With emotional support, Sofia leads youth groups to inspire other orphans."' },
            ].map((s, i) => (
              <div className="story-card scroll-reveal" key={i}>
                <div className="story-img">{s.emoji}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
                <a href="#" className="story-link" onClick={(e) => e.preventDefault()}>Read full story →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="impact-wrapper scroll-reveal" id="impact">
        <div className="container impact-container">
          <div className="impact-strip">
            <div className="impact-number"><h3>2.8M</h3><p>Meals provided</p></div>
            <div className="impact-number"><h3>9,200</h3><p>Children educated</p></div>
            <div className="impact-number"><h3>1,450</h3><p>Foster placements</p></div>
            <div className="impact-number"><h3>32</h3><p>Countries reached</p></div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container">
        <div className="cta-block scroll-reveal">
          <h2><i className="fas fa-heart"></i> Become a Guardian Angel</h2>
          <p>Your monthly support gives a child education, meals, and unwavering hope. Together we rewrite their story.</p>
          <button className="btn btn-outline-light" onClick={() => navigate('/signup-choice')}>
            <i className="fas fa-hand-holding-heart"></i> Help Orphan Today
          </button>
          <div className="cta-phone"><i className="fas fa-phone-alt"></i> Call us: +1 (888) 422-HELP</div>
        </div>
      </div>

      {/* About & Contact */}
      <div className="section about-section" id="about">
        <div className="container">
          <div className="about-contact-grid">
            <div className="about-col scroll-reveal">
              <h3>About NurtureOrphan</h3>
              <p>We are a global non-profit dedicated to transforming the lives of orphaned and vulnerable children. Since 2012, we've partnered with local communities to provide sustainable care, education, and love.</p>
              <button className="btn btn-outline" style={{ color: 'var(--brand, #e8714a)', borderColor: 'var(--brand, #e8714a)' }} onClick={() => navigate('/about')}>Learn more →</button>
            </div>
            <div className="contact-col scroll-reveal">
              <h3>Contact Us</h3>
              <p><i className="fas fa-envelope"></i> hello@nurtureorphan.org</p>
              <p><i className="fas fa-phone-alt"></i> +1 (888) 273-4226</p>
              <p><i className="fas fa-map-marker-alt"></i> 123 Hope Street, NY 10001</p>
              <div className="social-icons">
                <i className="fab fa-facebook-f"></i>
                <i className="fab fa-instagram"></i>
                <i className="fab fa-twitter"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <div className="logo"><i className="fas fa-hand-holding-heart"></i> NurtureOrphan</div>
            <p>Bringing hope, relief, and lasting change to orphan children worldwide.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#programs">Education</a>
            <a href="#stories">Stories</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/donation'); }}>Donate</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">FAQs</a>
            <a href="#">Transparency</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/volunteer-apply'); }}>Volunteer</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="container copyright">
          <p>© 2025 NurtureOrphan — Compassion in action. Every child matters. <i className="fas fa-heart"></i></p>
        </div>
      </footer>
    </>
  );
};

export default Home;