import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Globe className="logo-icon" />
          <span>Geospatial Club</span>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </div>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" className="nav-item" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" className="nav-item" onClick={closeMenu}>About</NavLink>
          <NavLink to="/events" className="nav-item" onClick={closeMenu}>Events</NavLink>
          <NavLink to="/projects" className="nav-item" onClick={closeMenu}>Projects</NavLink>
          <Link to="/projects" className="btn btn-primary nav-btn" onClick={closeMenu}>Explore Our Work</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
