import React, { createContext, useContext, useState, useEffect } from 'react';
import { upcomingEvents as initialUpcoming, pastEvents as initialPast } from '../data/events';
import { projects as initialProjects } from '../data/projects';
import { clubInfo as initialClubInfo } from '../data/club';
import { initialFaculty } from '../data/faculty';

import { exportRegistrationsToExcel } from '../utils/excelExport';
import { supabase } from '../supabaseClient';

const STORAGE_KEY = 'geospatial_srm_state_v3';

const DataContext = createContext(null);

const initialRegistrations = [
  {
    id: "REG-GEO-1001",
    eventId: "evt-001",
    eventTitle: "GeoAI & Smart Mapping Workshop",
    name: "Kavya Sundaram",
    email: "ks8214@srmist.edu.in",
    registerNumber: "RA2311003010145",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 98765 43210",
    registeredAt: "10 Oct 2026, 02:40 PM"
  },
  {
    id: "REG-GEO-1002",
    eventId: "evt-001",
    eventTitle: "GeoAI & Smart Mapping Workshop",
    name: "Aditya Nair",
    email: "an3921@srmist.edu.in",
    registerNumber: "RA2311003010212",
    department: "Data Science & GeoAI",
    year: "2nd Year",
    phone: "+91 91234 56780",
    registeredAt: "10 Oct 2026, 05:15 PM"
  },
  {
    id: "REG-GEO-1003",
    eventId: "evt-002",
    eventTitle: "Introduction to Remote Sensing",
    name: "Sneha Reddy",
    email: "sr9042@srmist.edu.in",
    registerNumber: "RA2211004020088",
    department: "Civil Engineering & GIS",
    year: "4th Year",
    phone: "+91 99887 76655",
    registeredAt: "11 Oct 2026, 08:30 AM"
  }
];

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
  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_registrations`);
      return saved ? JSON.parse(saved) : initialRegistrations;
    } catch {
      return initialRegistrations;
    }
  });

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

  // Live synchronization from Supabase cloud database
  useEffect(() => {
    let isMounted = true;

    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch live registrations
        const { data: regData, error: regError } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!regError && regData && regData.length > 0 && isMounted) {
          setRegistrations(regData);
        }

        // 2. Fetch live messages
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!msgError && msgData && msgData.length > 0 && isMounted) {
          setMessages(msgData);
        }

        // 3. Fetch events
        const { data: evData, error: evError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (!evError && evData && evData.length > 0 && isMounted) {
          setUpcomingEvents(evData.filter(e => e.isUpcoming));
          setPastEvents(evData.filter(e => !e.isUpcoming));
        }

        // 4. Fetch projects
        const { data: projData, error: projError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (!projError && projData && projData.length > 0 && isMounted) {
          setProjects(projData);
        }

        // 5. Fetch faculty
        const { data: facData, error: facError } = await supabase
          .from('faculty')
          .select('*')
          .order('created_at', { ascending: false });

        if (!facError && facData && facData.length > 0 && isMounted) {
          setFaculty(facData);
        }

        // 6. Fetch site_settings / portfolio details
        const { data: settsData, error: settsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        if (!settsError && settsData && isMounted) {
          setClubInfo(prev => ({
            ...prev,
            name: settsData.name || prev.name,
            institution: settsData.institution || prev.institution,
            tagline: settsData.tagline || prev.tagline,
            heroDescription: settsData.heroDescription || prev.heroDescription,
            aboutDescription: settsData.aboutDescription || prev.aboutDescription,
            vision: settsData.vision || prev.vision,
            mission: settsData.mission || prev.mission,
            stats: settsData.stats ? (Array.isArray(settsData.stats) ? settsData.stats : JSON.parse(settsData.stats)) : prev.stats
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch note:', err);
      }
    };

    fetchSupabaseData();

    // Set up Realtime channel subscription for instant Admin <-> Portfolio sync
    const realtimeChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setRegistrations(prev => [payload.new, ...prev.filter(r => r.id !== payload.new.id)]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setRegistrations(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setMessages(prev => [payload.new, ...prev.filter(m => m.id !== payload.new.id)]);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          supabase.from('events').select('*').order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) {
                setUpcomingEvents(data.filter(e => e.isUpcoming));
                setPastEvents(data.filter(e => !e.isUpcoming));
              }
            });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          supabase.from('projects').select('*').order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) setProjects(data);
            });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'faculty' },
        () => {
          supabase.from('faculty').select('*').order('created_at', { ascending: false })
            .then(({ data }) => {
              if (data && data.length > 0) setFaculty(data);
            });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          if (payload.new) {
            setClubInfo(prev => ({
              ...prev,
              ...payload.new,
              stats: payload.new.stats ? (Array.isArray(payload.new.stats) ? payload.new.stats : JSON.parse(payload.new.stats)) : prev.stats
            }));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

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

    // Asynchronously insert into Supabase
    supabase.from('messages').insert([{
      id: newMessage.id,
      name: newMessage.name,
      email: newMessage.email,
      comment: newMessage.comment,
      timestamp: newMessage.timestamp,
      read: newMessage.read
    }]).then(() => {}).catch(err => console.warn('Supabase msg insert err:', err));

    return { success: true, message: newMessage };
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    supabase.from('messages').delete().eq('id', id).then(() => {}).catch(err => console.warn('Supabase msg del err:', err));
  };

  const markMessageAsRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    supabase.from('messages').update({ read: true }).eq('id', id).then(() => {}).catch(err => console.warn('Supabase msg update err:', err));
  };

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_registrations`, JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to save registrations to localStorage', e);
    }
  }, [registrations]);

  // --- EVENT REGISTRATIONS ACTIONS ---
  const addRegistration = ({ eventId, eventTitle, name, email, registerNumber, department, year, phone }) => {
    const trimmedEmail = email?.trim().toLowerCase() || '';
    if (!trimmedEmail.endsWith('@srmist.edu.in')) {
      return { 
        success: false, 
        error: 'Only @srmist.edu.in institutional email addresses are permitted (e.g. yourname@srmist.edu.in).' 
      };
    }

    if (!name?.trim() || !registerNumber?.trim() || !phone?.trim()) {
      return {
        success: false,
        error: 'Please fill in all required fields (Name, Register Number, Phone Number).'
      };
    }

    // Check for duplicate registration for same event
    const duplicate = registrations.find(
      r => r.eventId === eventId && (
        r.email.toLowerCase() === trimmedEmail || 
        r.registerNumber.toLowerCase() === registerNumber.trim().toLowerCase()
      )
    );
    if (duplicate) {
      return {
        success: false,
        error: 'You are already registered for this event with this email or register number!'
      };
    }

    const newRegistration = {
      id: `REG-GEO-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId,
      eventTitle: eventTitle || 'Geospatial Event',
      name: name.trim(),
      email: trimmedEmail,
      registerNumber: registerNumber.trim().toUpperCase(),
      department: department?.trim() || 'General Engineering',
      year: year || '3rd Year',
      phone: phone.trim(),
      registeredAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };

    setRegistrations(prev => [newRegistration, ...prev]);

    // Asynchronously insert into Supabase registrations table
    supabase.from('registrations').insert([{
      id: newRegistration.id,
      eventId: newRegistration.eventId,
      eventTitle: newRegistration.eventTitle,
      name: newRegistration.name,
      email: newRegistration.email,
      registerNumber: newRegistration.registerNumber,
      department: newRegistration.department,
      year: newRegistration.year,
      phone: newRegistration.phone,
      registeredAt: newRegistration.registeredAt
    }]).then(({ error }) => {
      if (error) console.warn('Supabase registration insert note:', error.message);
    }).catch(err => console.warn('Supabase registration insert err:', err));

    return { success: true, registration: newRegistration };
  };

  const deleteRegistration = (id) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
    supabase.from('registrations').delete().eq('id', id).then(() => {}).catch(err => console.warn('Supabase reg del err:', err));
  };

  const exportRegistrationsExcel = (eventId = null) => {
    const target = eventId 
      ? registrations.filter(r => r.eventId === eventId)
      : registrations;
    
    let title = 'All_Events';
    if (eventId) {
      const match = upcomingEvents.find(e => e.id === eventId) || pastEvents.find(e => e.id === eventId);
      title = match ? match.title : `Event_${eventId}`;
    }
    exportRegistrationsToExcel(target, title);
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

    supabase.from('events').insert([{
      id: newEvent.id,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
      description: newEvent.description,
      image: newEvent.image,
      isUpcoming: isUpcoming,
      registrationType: newEvent.registrationType || 'form',
      registrationLink: newEvent.registrationLink || '',
      registrationOpen: newEvent.registrationOpen ?? true
    }]).then(() => {}).catch(err => console.warn('Supabase addEvent err:', err));

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

    supabase.from('events').update(updatedFields).eq('id', id).then(() => {}).catch(err => console.warn('Supabase updateEvent err:', err));
  };

  const deleteEvent = (id, isUpcoming = true) => {
    if (isUpcoming) {
      setUpcomingEvents(prev => prev.filter(evt => evt.id !== id));
    } else {
      setPastEvents(prev => prev.filter(evt => evt.id !== id));
    }

    supabase.from('events').delete().eq('id', id).then(() => {}).catch(err => console.warn('Supabase deleteEvent err:', err));
  };

  const toggleEventStatus = (id) => {
    const upcomingMatch = upcomingEvents.find(e => e.id === id);
    if (upcomingMatch) {
      setUpcomingEvents(prev => prev.filter(e => e.id !== id));
      setPastEvents(prev => [{ ...upcomingMatch }, ...prev]);
      supabase.from('events').update({ isUpcoming: false }).eq('id', id).then(() => {}).catch(err => console.warn(err));
      return 'done';
    }

    const pastMatch = pastEvents.find(e => e.id === id);
    if (pastMatch) {
      setPastEvents(prev => prev.filter(e => e.id !== id));
      setUpcomingEvents(prev => [{ ...pastMatch }, ...prev]);
      supabase.from('events').update({ isUpcoming: true }).eq('id', id).then(() => {}).catch(err => console.warn(err));
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

    supabase.from('projects').insert([{
      ...newProject,
      technologies: JSON.stringify(newProject.technologies),
      objectives: JSON.stringify(newProject.objectives)
    }]).then(() => {}).catch(err => console.warn('Supabase addProject err:', err));

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

    supabase.from('projects').update(updatedFields).eq('id', id).then(() => {}).catch(err => console.warn('Supabase updateProject err:', err));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    supabase.from('projects').delete().eq('id', id).then(() => {}).catch(err => console.warn('Supabase deleteProject err:', err));
  };

  // --- FACULTY ACTIONS ---
  const addFaculty = (facultyData) => {
    const newFaculty = {
      ...facultyData,
      id: facultyData.id || `fac-${Date.now()}`
    };
    setFaculty(prev => [...prev, newFaculty]);
    supabase.from('faculty').insert([newFaculty]).then(() => {}).catch(err => console.warn('Supabase addFaculty err:', err));
    return newFaculty;
  };

  const updateFaculty = (id, updatedFields) => {
    setFaculty(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updatedFields } : f))
    );
    supabase.from('faculty').update(updatedFields).eq('id', id).then(() => {}).catch(err => console.warn('Supabase updateFaculty err:', err));
  };

  const deleteFaculty = (id) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
    supabase.from('faculty').delete().eq('id', id).then(() => {}).catch(err => console.warn('Supabase deleteFaculty err:', err));
  };

  // --- CLUB INFO & STATS ACTIONS ---
  const updateClubInfo = (updatedFields) => {
    setClubInfo(prev => {
      const merged = {
        ...prev,
        ...updatedFields
      };

      // Sync to Supabase site_settings table
      supabase.from('site_settings').upsert({
        id: 'default',
        name: merged.name,
        institution: merged.institution,
        tagline: merged.tagline,
        heroDescription: merged.heroDescription,
        aboutDescription: merged.aboutDescription,
        vision: merged.vision,
        mission: merged.mission,
        stats: merged.stats,
        updated_at: new Date().toISOString()
      }).then(() => {}).catch(err => console.warn('Supabase site_settings update err:', err));

      return merged;
    });
  };

  const updateStats = (statsArray) => {
    setClubInfo(prev => {
      const merged = {
        ...prev,
        stats: statsArray
      };

      // Sync to Supabase site_settings table
      supabase.from('site_settings').upsert({
        id: 'default',
        name: merged.name,
        institution: merged.institution,
        tagline: merged.tagline,
        heroDescription: merged.heroDescription,
        aboutDescription: merged.aboutDescription,
        vision: merged.vision,
        mission: merged.mission,
        stats: statsArray,
        updated_at: new Date().toISOString()
      }).then(() => {}).catch(err => console.warn('Supabase site_settings stats err:', err));

      return merged;
    });
  };

  // --- RESET & EXPORT / IMPORT ---
  const resetToDefaults = () => {
    setUpcomingEvents(initialUpcoming);
    setPastEvents(initialPast);
    setProjects(initialProjects);
    setFaculty(initialFaculty);
    setClubInfo(initialClubInfo);
    setMessages(initialMessages);
    setRegistrations(initialRegistrations);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_upcoming_events`);
      localStorage.removeItem(`${STORAGE_KEY}_past_events`);
      localStorage.removeItem(`${STORAGE_KEY}_projects`);
      localStorage.removeItem(`${STORAGE_KEY}_faculty`);
      localStorage.removeItem(`${STORAGE_KEY}_club_info`);
      localStorage.removeItem(`${STORAGE_KEY}_messages`);
      localStorage.removeItem(`${STORAGE_KEY}_registrations`);
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
      messages,
      registrations
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
    if (Array.isArray(importedData.registrations)) setRegistrations(importedData.registrations);
  };

  const value = {
    upcomingEvents,
    pastEvents,
    projects,
    faculty,
    clubInfo,
    messages,
    registrations,
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
    addRegistration,
    deleteRegistration,
    exportRegistrationsExcel,
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
