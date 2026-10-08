import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = ({ title, subtitle, description, buttons, image, layout = "center" }) => {
  return (
    <div className={`hero-section layout-${layout}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        {subtitle && <h3 className="hero-subtitle">{subtitle}</h3>}
        <h1 className="hero-title">{title}</h1>
        {description && <p className="hero-description">{description}</p>}
        {buttons && (
          <div className="hero-buttons">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
