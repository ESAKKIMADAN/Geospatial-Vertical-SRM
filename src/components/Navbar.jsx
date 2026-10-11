import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';
import ContactModal from './ContactModal';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={`portfolio-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container portfolio-nav-container">
          <Link to="/" className="portfolio-brand" onClick={closeMenu}>
            <span className="portfolio-brand-title">Geospatial Computing Research Vertical</span>
          </Link>
          
          <div className="portfolio-menu-icon" onClick={toggleMenu} aria-label="Toggle navigation">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          <nav className={`portfolio-nav-menu ${isOpen ? 'active' : ''}`}>
            <NavLink to="/" className="portfolio-nav-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className="portfolio-nav-link" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/events" className="portfolio-nav-link" onClick={closeMenu}>
              Events
            </NavLink>
            <NavLink to="/projects" className="portfolio-nav-link" onClick={closeMenu}>
              Projects
            </NavLink>
            
            <button 
              type="button" 
              className="portfolio-contact-btn" 
              onClick={() => {
                closeMenu();
                setIsContactOpen(true);
              }}
            >
              <Mail size={15} /> <span>Contact</span>
            </button>
          </nav>
        </div>
      </header>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </>
  );
};

export default Navbar;
