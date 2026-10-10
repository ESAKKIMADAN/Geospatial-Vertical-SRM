import React from 'react';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { FeatureCard } from '../components/Cards';
import { useData } from '../context/DataContext';
import { Mail, MapPin, Globe } from 'lucide-react';

const About = () => {
  const { clubInfo, faculty } = useData();

  return (
    <div className="page-transition">
      <HeroSection 
        title="ABOUT GEOSPATIAL COMPUTING RESEARCH VERTICAL"
        subtitle="Connecting Geography, Computing and Technological Innovation"
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="About the Research Vertical" />
          <p className="text-center" style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: '1.8' }}>
            {clubInfo.aboutDescription}
          </p>
        </div>
      </section>

      {/* Faculty Mentors & Advisors Section */}
      <section className="section bg-light">
        <div className="container">
          <SectionHeader 
            title="Faculty Mentors & Advisory Board" 
            subtitle="Distinguished professors and academic mentors guiding our research and student initiatives." 
          />
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {faculty.map((member) => (
              <div 
                key={member.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '2rem',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <img 
                    src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                    alt={member.name} 
                    style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--secondary)' }} 
                  />
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {member.name}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 600 }}>
                      {member.designation}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {member.department}
                    </div>
                  </div>
                </div>

                {member.bio && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                    {member.bio}
                  </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-light)' }}>
                  {member.domain && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={15} color="var(--secondary)" />
                      <span><strong>Domain:</strong> {member.domain}</span>
                    </div>
                  )}
                  {member.office && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={15} color="var(--secondary)" />
                      <span>{member.office}</span>
                    </div>
                  )}
                  {member.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={15} color="var(--secondary)" />
                      <a href={`mailto:${member.email}`} style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>{member.email}</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Our Focus" subtitle="Areas of exploration and academic interest." />
          <div className="grid grid-3">
            {clubInfo.focusAreas?.map((area, index) => (
              <FeatureCard key={index} title={area.title} icon={area.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
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

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="Objectives" />
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', fontSize: '1.1rem', color: 'var(--text-main)' }}>
            {clubInfo.objectives?.map((obj, index) => (
              <li key={index} style={{ marginBottom: '1rem' }}>{obj}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
