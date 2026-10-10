import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { FeatureCard, StatCard, EventCard, ProjectCard } from '../components/Cards';
import CTASection from '../components/CTASection';
import ProjectModal from '../components/ProjectModal';
import { useData } from '../context/DataContext';

const Home = () => {
  const { clubInfo, upcomingEvents, projects } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="page-transition">
      <HeroSection 
        title={clubInfo.name}
        subtitle={clubInfo.tagline}
        description={clubInfo.heroDescription}
        image="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        buttons={
          <>
            <Link to="/projects" className="btn btn-primary">Explore Our Work</Link>
            <Link to="/about" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Discover the Club</Link>
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

      <section className="section" style={{ backgroundColor: 'var(--primary)' }}>
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
              <EventCard event={upcomingEvents[0]} type="upcoming" />
            )}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <SectionHeader title="Featured Current Project" />
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {projects.length > 0 && (
              <ProjectCard project={projects[0]} onClick={setSelectedProject} />
            )}
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <SectionHeader title="Vision" />
          <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-light)' }}>
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

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Home;
