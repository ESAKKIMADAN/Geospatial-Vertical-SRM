import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Globe className="logo-icon" />
              <span>Geospatial Club</span>
            </Link>
            <p className="footer-tagline">Explore • Analyze • Innovate</p>
            <p className="footer-desc">SRM Institute of Science and Technology</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/projects">Projects</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li><MapPin size={18} /> SRMIST, Kattankulathur, Chennai</li>
              <li><Mail size={18} /> contact@geospatialclub.srm</li>
            </ul>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="Instagram">IG</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Geospatial Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
