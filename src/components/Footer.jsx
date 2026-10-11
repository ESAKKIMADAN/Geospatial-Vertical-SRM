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
              <span>Geospatial Computing Research Vertical</span>
            </Link>
            <p className="footer-tagline">Explore • Analyze • Innovate</p>
            <p className="footer-desc">SRM Institute of Science and Technology</p>
          </div>
          
            <div className="footer-contact">
              <h3>Contact Us</h3>
              <ul>
                <li><MapPin size={18} /> SRMIST, Kattankulathur, Chennai</li>
                <li><Mail size={18} /> geospatial.vertical@srmist.edu.in</li>
              </ul>
            </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Geospatial Computing Research Vertical. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
