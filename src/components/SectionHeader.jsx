import React from 'react';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`section-header ${centered ? 'text-center' : ''}`} style={{ marginBottom: '3rem' }}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
