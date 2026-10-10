import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { ProjectCard } from '../components/Cards';
import ProjectModal from '../components/ProjectModal';
import { useData } from '../context/DataContext';

const Projects = () => {
  const { projects } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="page-transition">
      <HeroSection 
        title="CURRENT PROJECTS"
        subtitle="Student Ideas. Geospatial Technology. Real-World Impact."
        image="https://images.unsplash.com/photo-1498084393753-b411b2d26b34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="section bg-light">
        <div className="container">
          <SectionHeader title="Our Initiatives" subtitle="Exploring solutions through spatial data and technology." />
          {projects.length > 0 ? (
            <div className="grid grid-3">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
              ))}
            </div>
          ) : (
            <p className="text-center text-light" style={{ fontSize: '1.1rem', padding: '2rem 0' }}>
              No projects added yet. Visit the Admin portal to create one!
            </p>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
};

export default Projects;
