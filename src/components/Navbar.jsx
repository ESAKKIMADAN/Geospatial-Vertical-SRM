import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe, Mail } from 'lucide-react';
import ContactModal from './ContactModal';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <Globe className="logo-icon" />
            <span>Geospatial Computing Research Vertical</span>
          </Link>
          
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? <X /> : <Menu />}
          </div>

          <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <NavLink to="/" className="nav-item" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" className="nav-item" onClick={closeMenu}>About</NavLink>
            <NavLink to="/events" className="nav-item" onClick={closeMenu}>Events</NavLink>
            <NavLink to="/projects" className="nav-item" onClick={closeMenu}>Projects</NavLink>
            <button 
              type="button" 
              className="btn btn-primary nav-btn" 
              onClick={() => {
                closeMenu();
                setIsContactOpen(true);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Mail size={16} /> Contact
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
