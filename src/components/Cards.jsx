import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Activity, Map, Satellite, BrainCircuit, Database, Eye, Lightbulb, ExternalLink, Send } from 'lucide-react';
import '../styles/Cards.css';

const IconMap = {
  Map, Satellite, BrainCircuit, Database, Eye, Lightbulb
};

export const FeatureCard = ({ title, description, icon }) => {
  const Icon = IconMap[icon] || Map;
  return (
    <div className="card feature-card">
      <div className="feature-icon">
        <Icon size={32} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{description}</p>
    </div>
  );
};

export const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export const EventCard = ({ event, type = 'upcoming', onRegister }) => {
  const isLink = event.registrationType === 'link' && event.registrationLink;

  return (
    <div className="card event-card">
      <div className="card-image-wrapper">
        <img src={event.image} alt={event.title} className="card-image" />
        {type === 'upcoming' && <div className="event-badge">Upcoming</div>}
      </div>
      <div className="card-content">
        <h3 className="card-title">{event.title}</h3>
        <div className="event-details">
          {event.date && <span><Calendar size={16} /> {event.date}</span>}
          {event.time && <span><Clock size={16} /> {event.time}</span>}
          {event.venue && <span><MapPin size={16} /> {event.venue}</span>}
        </div>
        <p className="card-text">{event.description}</p>
        
        {type === 'upcoming' ? (
          isLink ? (
            <a 
              href={event.registrationLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary card-btn"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <ExternalLink size={15} /> Register (External Portal)
            </a>
          ) : (
            <button 
              className="btn btn-primary card-btn" 
              onClick={() => onRegister && onRegister(event)}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Send size={15} /> Register Now
            </button>
          )
        ) : (
          <button className="btn btn-outline card-btn" disabled style={{ opacity: 0.7, cursor: 'default' }}>
            Completed Activity
          </button>
        )}
      </div>
    </div>
  );
};

export const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="card project-card">
      <div className="card-image-wrapper">
        <img src={project.image} alt={project.title} className="card-image" />
        <div className="project-status">{project.status}</div>
      </div>
      <div className="card-content">
        <div className="project-domain">{project.domain}</div>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-text">{project.description}</p>
        <div className="project-meta">
          <span><Activity size={16} /> {project.facultyMentor}</span>
          <span><Users size={16} /> {project.studentTeam}</span>
        </div>
        <button className="btn btn-primary card-btn" onClick={() => onClick(project)}>View Project</button>
      </div>
    </div>
  );
};
