import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <div className="project-domain">{project.domain}</div>
          <h2 className="modal-title">{project.title}</h2>
          <div className="modal-meta">
            <span className="badge">{project.status}</span>
          </div>
        </div>
        
        <div className="modal-body">
          {project.image && (
            <img src={project.image} alt={project.title} className="modal-image" />
          )}
          
          <div className="modal-grid">
            <div className="modal-main">
              <h3>Project Overview</h3>
              <p>{project.overview}</p>
              
              <h3>Problem Statement</h3>
              <p>{project.problemStatement}</p>
              
              <h3>Methodology</h3>
              <p>{project.methodology}</p>
              
              <h3>Expected Outcome</h3>
              <p>{project.expectedOutcome}</p>
            </div>
            
            <div className="modal-sidebar">
              <div className="info-block">
                <h4>Faculty Mentor</h4>
                <p>{project.facultyMentor}</p>
              </div>
              
              <div className="info-block">
                <h4>Student Team</h4>
                <p>{project.studentTeam}</p>
              </div>
              
              <div className="info-block">
                <h4>Objectives</h4>
                <ul>
                  {project.objectives?.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
              
              <div className="info-block">
                <h4>Technologies</h4>
                <div className="tags">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
