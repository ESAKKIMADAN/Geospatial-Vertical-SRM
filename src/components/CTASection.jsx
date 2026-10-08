import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CTASection.css';

const CTASection = ({ title, buttonText, buttonLink, image }) => {
  return (
    <section className="cta-section" style={{ backgroundImage: `url(${image})` }}>
      <div className="cta-overlay"></div>
      <div className="container cta-content text-center">
        <h2>{title}</h2>
        <Link to={buttonLink} className="btn btn-secondary">{buttonText}</Link>
      </div>
    </section>
  );
};

export default CTASection;
