import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EarthBackground from '../components/EarthBackground';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { FeatureCard, StatCard, EventCard } from '../components/Cards';
import CTASection from '../components/CTASection';
import EventRegisterModal from '../components/EventRegisterModal';
import { useData } from '../context/DataContext';
import '../styles/Home.css';

const Home = () => {
  const { clubInfo, upcomingEvents } = useData();
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState(null);

  return (
    <div className="page-transition home-page-container">
      {/* 3D Interactive Earth & Space Background */}
      <EarthBackground />

      <HeroSection 
        title={clubInfo.name}
        subtitle="Department of Computing Technologies"
        description={clubInfo.heroDescription}
        transparent={true}
        image="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        buttons={
          <>
            <Link to="/projects" className="btn btn-primary">Explore Our Projects</Link>
            <Link to="/about" className="btn btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}>About the Vertical</Link>
          </>
        }
      />

      <section className="section bg-light">
        <div className="container">
          <SectionHeader title="What We Do" subtitle="Exploring the intersection of geography, data, and technology." />
          <div className="grid grid-4">
            {clubInfo.features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="section home-stats-section">
        <div className="container">
          <div className="grid grid-4">
            {clubInfo.stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title="Featured Upcoming Event" />
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {upcomingEvents.length > 0 && (
              <EventCard 
                event={upcomingEvents[0]} 
                type="upcoming" 
                onRegister={setSelectedRegisterEvent} 
              />
            )}
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="Vision" />
          <p className="home-vision-text" style={{ fontSize: '1.25rem', fontStyle: 'italic' }}>
            "{clubInfo.vision}"
          </p>
        </div>
      </section>

      <CTASection 
        title="Discover the World Through Geospatial Technology"
        buttonText="Explore Our Projects"
        buttonLink="/projects"
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <EventRegisterModal 
        event={selectedRegisterEvent} 
        isOpen={Boolean(selectedRegisterEvent)} 
        onClose={() => setSelectedRegisterEvent(null)} 
      />
    </div>
  );
};

export default Home;
