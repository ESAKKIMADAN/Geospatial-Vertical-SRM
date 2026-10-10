import React, { createContext, useContext, useState, useEffect } from 'react';
import { upcomingEvents as initialUpcoming, pastEvents as initialPast } from '../data/events';
import { projects as initialProjects } from '../data/projects';
import { clubInfo as initialClubInfo } from '../data/club';
import { initialFaculty } from '../data/faculty';

const STORAGE_KEY = 'geospatial_srm_state_v3';

const DataContext = createContext(null);

const initialMessages = [
  {
    id: "msg-001",
    name: "Karthik R.",
    email: "kr8392@srmist.edu.in",
    comment: "I am interested in joining the Smart Urban Mapping project team. How can second-year students apply for upcoming workshops?",
    timestamp: "10 Oct 2026, 04:30 PM",
    read: false
  },
  {
    id: "msg-002",
    name: "Ananya Iyer",
    email: "ai4510@srmist.edu.in",
    comment: "Great workshop on Remote Sensing! Could you share the presentation slides and dataset links?",
    timestamp: "09 Oct 2026, 11:15 AM",
    read: true
  }
];

export const DataProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [upcomingEvents, setUpcomingEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_upcoming_events`);
      return saved ? JSON.parse(saved) : initialUpcoming;
    } catch {
      return initialUpcoming;
    }
  });

  const [pastEvents, setPastEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_past_events`);
      return saved ? JSON.parse(saved) : initialPast;
    } catch {
      return initialPast;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [faculty, setFaculty] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_faculty`);
      return saved ? JSON.parse(saved) : initialFaculty;
    } catch {
      return initialFaculty;
    }
  });

  const [clubInfo, setClubInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_club_info`);
      return saved ? JSON.parse(saved) : initialClubInfo;
    } catch {
      return initialClubInfo;
    }
  });

  // Admin Authentication State
  const [adminCredentials, setAdminCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admin_credentials`);
      return saved ? JSON.parse(saved) : { email: 'admin@srmist.edu.in', password: 'admin' };
    } catch {
      return { email: 'admin@srmist.edu.in', password: 'admin' };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(`${STORAGE_KEY}_auth`) === 'true';
    } catch {
      return false;
    }
  });

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const storedEmail = adminCredentials.email.trim().toLowerCase();
    if (trimmedEmail === storedEmail && password === adminCredentials.password) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(`${STORAGE_KEY}_auth`, 'true');
      } catch (e) {
        console.error('Session storage error', e);
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(`${STORAGE_KEY}_auth`);
    } catch (e) {
      console.error('Session storage error', e);
    }
  };

  const updateAdminCredentials = (newEmail, newPassword) => {
    const updated = {
      email: newEmail.trim(),
      password: newPassword
    };
    setAdminCredentials(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_admin_credentials`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save admin credentials', e);
    }
  };

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_upcoming_events`, JSON.stringify(upcomingEvents));
    } catch (e) {
      console.error('Failed to save upcoming events to localStorage', e);
    }
  }, [upcomingEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_past_events`, JSON.stringify(pastEvents));
    } catch (e) {
      console.error('Failed to save past events to localStorage', e);
    }
  }, [pastEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_faculty`, JSON.stringify(faculty));
    } catch (e) {
      console.error('Failed to save faculty to localStorage', e);
    }
  }, [faculty]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_club_info`, JSON.stringify(clubInfo));
    } catch (e) {
      console.error('Failed to save club info to localStorage', e);
    }
  }, [clubInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages to localStorage', e);
    }
  }, [messages]);

  // --- CONTACT MESSAGES ACTIONS ---
  const addMessage = ({ name, email, comment }) => {
    const trimmedEmail = email?.trim().toLowerCase() || '';
    if (!trimmedEmail.endsWith('@srmist.edu.in')) {
      return { 
        success: false, 
        error: 'Only @srmist.edu.in institutional email addresses are permitted (e.g. ab1234@srmist.edu.in).' 
      };
    }

    if (!comment || !comment.trim()) {
      return {
        success: false,
        error: 'Please enter your message/comments.'
      };
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: name?.trim() || 'SRMIST Student',
      email: trimmedEmail,
      comment: comment.trim(),
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      read: false
    };

    setMessages(prev => [newMessage, ...prev]);
    return { success: true, message: newMessage };
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const markMessageAsRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  // --- EVENTS ACTIONS ---
  const addEvent = (eventData, isUpcoming = true) => {
    const newEvent = {
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`
    };
    if (isUpcoming) {
      setUpcomingEvents(prev => [newEvent, ...prev]);
    } else {
      setPastEvents(prev => [newEvent, ...prev]);
    }
    return newEvent;
  };

  const updateEvent = (id, updatedFields, isUpcoming = true) => {
    if (isUpcoming) {
      setUpcomingEvents(prev =>
        prev.map(evt => (evt.id === id ? { ...evt, ...updatedFields } : evt))
      );
    } else {
      setPastEvents(prev =>
        prev.map(evt => (evt.id === id ? { ...evt, ...updatedFields } : evt))
      );
    }
  };

  const deleteEvent = (id, isUpcoming = true) => {
    if (isUpcoming) {
      setUpcomingEvents(prev => prev.filter(evt => evt.id !== id));
    } else {
      setPastEvents(prev => prev.filter(evt => evt.id !== id));
    }
  };

  const toggleEventStatus = (id) => {
    const upcomingMatch = upcomingEvents.find(e => e.id === id);
    if (upcomingMatch) {
      setUpcomingEvents(prev => prev.filter(e => e.id !== id));
      setPastEvents(prev => [{ ...upcomingMatch }, ...prev]);
      return 'done';
    }

    const pastMatch = pastEvents.find(e => e.id === id);
    if (pastMatch) {
      setPastEvents(prev => prev.filter(e => e.id !== id));
      setUpcomingEvents(prev => [{ ...pastMatch }, ...prev]);
      return 'upcoming';
    }
    return null;
  };

  // --- PROJECTS ACTIONS ---
  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}`,
      status: projectData.status || 'Ongoing',
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : typeof projectData.technologies === 'string'
        ? projectData.technologies.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      objectives: Array.isArray(projectData.objectives)
        ? projectData.objectives
        : typeof projectData.objectives === 'string'
        ? projectData.objectives.split('\n').map(s => s.trim()).filter(Boolean)
        : []
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id, updatedFields) => {
    setProjects(prev =>
      prev.map(proj => {
        if (proj.id === id) {
          const techArray = Array.isArray(updatedFields.technologies)
            ? updatedFields.technologies
            : typeof updatedFields.technologies === 'string'
            ? updatedFields.technologies.split(',').map(s => s.trim()).filter(Boolean)
            : proj.technologies;

          const objArray = Array.isArray(updatedFields.objectives)
            ? updatedFields.objectives
            : typeof updatedFields.objectives === 'string'
            ? updatedFields.objectives.split('\n').map(s => s.trim()).filter(Boolean)
            : proj.objectives;

          return {
            ...proj,
            ...updatedFields,
            technologies: techArray,
            objectives: objArray
          };
        }
        return proj;
      })
    );
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // --- FACULTY ACTIONS ---
  const addFaculty = (facultyData) => {
    const newFaculty = {
      ...facultyData,
      id: facultyData.id || `fac-${Date.now()}`
    };
    setFaculty(prev => [...prev, newFaculty]);
    return newFaculty;
  };

  const updateFaculty = (id, updatedFields) => {
    setFaculty(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updatedFields } : f))
    );
  };

  const deleteFaculty = (id) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  // --- CLUB INFO & STATS ACTIONS ---
  const updateClubInfo = (updatedFields) => {
    setClubInfo(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const updateStats = (statsArray) => {
    setClubInfo(prev => ({
      ...prev,
      stats: statsArray
    }));
  };

  // --- RESET & EXPORT / IMPORT ---
  const resetToDefaults = () => {
    setUpcomingEvents(initialUpcoming);
    setPastEvents(initialPast);
    setProjects(initialProjects);
    setFaculty(initialFaculty);
    setClubInfo(initialClubInfo);
    setMessages(initialMessages);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_upcoming_events`);
      localStorage.removeItem(`${STORAGE_KEY}_past_events`);
      localStorage.removeItem(`${STORAGE_KEY}_projects`);
      localStorage.removeItem(`${STORAGE_KEY}_faculty`);
      localStorage.removeItem(`${STORAGE_KEY}_club_info`);
      localStorage.removeItem(`${STORAGE_KEY}_messages`);
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  };

  const exportDataJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      clubInfo,
      upcomingEvents,
      pastEvents,
      projects,
      faculty,
      messages
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `geospatial_srm_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = (importedData) => {
    if (importedData.clubInfo) setClubInfo(importedData.clubInfo);
    if (Array.isArray(importedData.upcomingEvents)) setUpcomingEvents(importedData.upcomingEvents);
    if (Array.isArray(importedData.pastEvents)) setPastEvents(importedData.pastEvents);
    if (Array.isArray(importedData.projects)) setProjects(importedData.projects);
    if (Array.isArray(importedData.faculty)) setFaculty(importedData.faculty);
    if (Array.isArray(importedData.messages)) setMessages(importedData.messages);
  };

  const value = {
    upcomingEvents,
    pastEvents,
    projects,
    faculty,
    clubInfo,
    messages,
    isAuthenticated,
    adminCredentials,
    login,
    logout,
    updateAdminCredentials,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
    addProject,
    updateProject,
    deleteProject,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    addMessage,
    deleteMessage,
    markMessageAsRead,
    updateClubInfo,
    updateStats,
    resetToDefaults,
    exportDataJSON,
    importDataJSON
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
