import React from 'react';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { FeatureCard } from '../components/Cards';
import { clubInfo } from '../data/club';

const About = () => {
  return (
    <div className="page-transition">
      <HeroSection 
        title="ABOUT THE GEOSPATIAL CLUB"
        subtitle="Connecting Geography, Technology and Innovation"
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="About the Club" />
          <p className="text-center" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            {clubInfo.aboutDescription}
          </p>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <SectionHeader title="Our Focus" subtitle="Areas of exploration and academic interest." />
          <div className="grid grid-3">
            {clubInfo.focusAreas.map((area, index) => (
              <FeatureCard key={index} title={area.title} icon={area.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <SectionHeader title="Vision" centered={false} />
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '2rem' }}>
                {clubInfo.vision}
              </p>
            </div>
            <div>
              <SectionHeader title="Mission" centered={false} />
              <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '2rem' }}>
                {clubInfo.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="Objectives" />
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>
            {clubInfo.objectives.map((obj, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>{obj}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
