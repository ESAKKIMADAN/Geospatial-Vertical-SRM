import React from 'react';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`section-header ${centered ? 'text-center' : ''}`}>
      <h2 className="section-title">{title}</h2>
      <div className="section-title-underline"></div>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
