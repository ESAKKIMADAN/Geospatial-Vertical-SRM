import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, Activity, Plus, Edit3, Trash2, 
  CheckCircle, ArrowRightLeft, Sparkles, Download, Upload, RotateCcw, 
  Search, ExternalLink, GraduationCap, FolderGit2, Settings, ShieldCheck,
  Check, Mail, Globe, Map, Lock, LogOut, Eye, EyeOff, AlertCircle, ArrowLeft, Key, MessageSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';
import '../styles/Admin.css';

const Admin = () => {
  const {
    upcomingEvents,
    pastEvents,
    projects,
    faculty,
    clubInfo,
    messages = [],
    deleteMessage,
    markMessageAsRead,
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
    updateClubInfo,
    updateStats,
    resetToDefaults,
    exportDataJSON,
    importDataJSON
  } = useData();

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Security Credentials form state in Settings
  const [securityEmail, setSecurityEmail] = useState(adminCredentials?.email || 'admin@srmist.edu.in');
  const [securityPassword, setSecurityPassword] = useState(adminCredentials?.password || 'admin');

  const [activeTab, setActiveTab] = useState('events'); // events | projects | faculty | messages | settings
  const [eventFilter, setEventFilter] = useState('all'); // all | upcoming | past
  const [projectStatusFilter, setProjectStatusFilter] = useState('all'); // all | Ongoing | Completed
  const [messageFilter, setMessageFilter] = useState('all'); // all | unread | read
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    image: '',
    statusType: 'upcoming'
  });

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    domain: '',
    facultyMentor: '',
    studentTeam: '',
    status: 'Ongoing',
    description: '',
    overview: '',
    problemStatement: '',
    objectives: '',
    methodology: '',
    technologies: '',
    expectedOutcome: '',
    image: ''
  });

  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    domain: '',
    bio: '',
    office: '',
    image: ''
  });

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState({
    name: clubInfo.name || '',
    institution: clubInfo.institution || '',
    tagline: clubInfo.tagline || '',
    heroDescription: clubInfo.heroDescription || '',
    aboutDescription: clubInfo.aboutDescription || '',
    vision: clubInfo.vision || '',
    mission: clubInfo.mission || '',
    stats: clubInfo.stats ? [...clubInfo.stats] : []
  });

  const fileInputId = useId();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = login(loginEmail, loginPassword);
    if (result.success) {
      setLoginError(null);
      showToast('Welcome back, Administrator!');
    } else {
      setLoginError(result.error || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    logout();
    setLoginPassword('');
    setLoginError(null);
    showToast('You have been logged out.');
  };

  const handleSaveSecurityCredentials = (e) => {
    e.preventDefault();
    if (!securityEmail.trim() || !securityPassword.trim()) {
      alert('Email and password are required');
      return;
    }
    updateAdminCredentials(securityEmail, securityPassword);
    showToast('Admin login credentials updated successfully!');
  };

  // --- EVENTS HANDLERS ---
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      date: '',
      time: '',
      venue: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      statusType: 'upcoming'
    });
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt, isUpcoming) => {
    setEditingEvent({ ...evt, isUpcoming });
    setEventFormData({
      title: evt.title || '',
      date: evt.date || '',
      time: evt.time || '',
      venue: evt.venue || '',
      description: evt.description || '',
      image: evt.image || '',
      statusType: isUpcoming ? 'upcoming' : 'past'
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) {
      alert('Event title is required');
      return;
    }

    if (editingEvent) {
      const isCurrentlyUpcoming = editingEvent.isUpcoming;
      const targetIsUpcoming = eventFormData.statusType === 'upcoming';

      if (isCurrentlyUpcoming === targetIsUpcoming) {
        updateEvent(editingEvent.id, {
          title: eventFormData.title,
          date: eventFormData.date,
          time: eventFormData.time,
          venue: eventFormData.venue,
          description: eventFormData.description,
          image: eventFormData.image
        }, targetIsUpcoming);
      } else {
        deleteEvent(editingEvent.id, isCurrentlyUpcoming);
        addEvent({
          id: editingEvent.id,
          title: eventFormData.title,
          date: eventFormData.date,
          time: eventFormData.time,
          venue: eventFormData.venue,
          description: eventFormData.description,
          image: eventFormData.image
        }, targetIsUpcoming);
      }
      showToast(`Event "${eventFormData.title}" updated successfully!`);
    } else {
      addEvent({
        title: eventFormData.title,
        date: eventFormData.date,
        time: eventFormData.time,
        venue: eventFormData.venue,
        description: eventFormData.description,
        image: eventFormData.image
      }, eventFormData.statusType === 'upcoming');
      showToast(`New event "${eventFormData.title}" created successfully!`);
    }
    setEventModalOpen(false);
  };

  const handleDeleteEvent = (id, isUpcoming, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteEvent(id, isUpcoming);
      showToast(`Event "${title}" deleted.`);
    }
  };

  const handleToggleEventStatus = (id, currentTitle) => {
    const newStatus = toggleEventStatus(id);
    showToast(
      newStatus === 'done' 
        ? `"${currentTitle}" moved to Completed Activities!` 
        : `"${currentTitle}" moved to Upcoming Events!`
    );
  };

  // --- PROJECTS HANDLERS ---
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectFormData({
      title: '',
      domain: 'GIS • Remote Sensing • GeoAI',
      facultyMentor: faculty[0]?.name || 'Dr. Arun Kumar',
      studentTeam: '5 Members',
      status: 'Ongoing',
      description: '',
      overview: '',
      problemStatement: '',
      objectives: '',
      methodology: '',
      technologies: 'QGIS, Python, React',
      expectedOutcome: '',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    setProjectFormData({
      title: proj.title || '',
      domain: proj.domain || '',
      facultyMentor: proj.facultyMentor || '',
      studentTeam: proj.studentTeam || '',
      status: proj.status || 'Ongoing',
      description: proj.description || '',
      overview: proj.overview || '',
      problemStatement: proj.problemStatement || '',
      objectives: Array.isArray(proj.objectives) ? proj.objectives.join('\n') : (proj.objectives || ''),
      methodology: proj.methodology || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      expectedOutcome: proj.expectedOutcome || '',
      image: proj.image || ''
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectFormData.title.trim()) {
      alert('Project title is required');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, projectFormData);
      showToast(`Project "${projectFormData.title}" updated successfully!`);
    } else {
      addProject(projectFormData);
      showToast(`New project "${projectFormData.title}" added successfully!`);
    }
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id, title) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      deleteProject(id);
      showToast(`Project "${title}" deleted.`);
    }
  };

  // --- FACULTY HANDLERS ---
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyFormData({
      name: '',
      designation: 'Assistant Professor & Faculty Mentor',
      department: 'Department of Remote Sensing & GIS',
      email: '',
      domain: 'Geospatial Analytics & Remote Sensing',
      bio: '',
      office: 'SRMIST Tech Park',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    });
    setFacultyModalOpen(true);
  };

  const handleOpenEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setFacultyFormData({
      name: fac.name || '',
      designation: fac.designation || '',
      department: fac.department || '',
      email: fac.email || '',
      domain: fac.domain || '',
      bio: fac.bio || '',
      office: fac.office || '',
      image: fac.image || ''
    });
    setFacultyModalOpen(true);
  };

  const handleSaveFaculty = (e) => {
    e.preventDefault();
    if (!facultyFormData.name.trim()) {
      alert('Faculty name is required');
      return;
    }

    if (editingFaculty) {
      updateFaculty(editingFaculty.id, facultyFormData);
      showToast(`Faculty profile for "${facultyFormData.name}" updated!`);
    } else {
      addFaculty(facultyFormData);
      showToast(`Faculty member "${facultyFormData.name}" added successfully!`);
    }
    setFacultyModalOpen(false);
  };

  const handleDeleteFaculty = (id, name) => {
    if (window.confirm(`Are you sure you want to delete faculty profile "${name}"?`)) {
      deleteFaculty(id);
      showToast(`Faculty "${name}" removed.`);
    }
  };

  // --- SETTINGS / CLUB INFO HANDLER ---
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateClubInfo({
      name: settingsFormData.name,
      institution: settingsFormData.institution,
      tagline: settingsFormData.tagline,
      heroDescription: settingsFormData.heroDescription,
      aboutDescription: settingsFormData.aboutDescription,
      vision: settingsFormData.vision,
      mission: settingsFormData.mission
    });
    updateStats(settingsFormData.stats);
    showToast('Club details & statistics updated successfully!');
  };

  const handleStatChange = (index, field, value) => {
    const updated = [...settingsFormData.stats];
    updated[index] = { ...updated[index], [field]: value };
    setSettingsFormData({ ...settingsFormData, stats: updated });
  };

  // --- BACKUP & RESTORE ---
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importDataJSON(parsed);
        showToast('Data imported and restored successfully!');
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to defaults? Any unsaved edits will be replaced.')) {
      resetToDefaults();
      showToast('All data has been reset to default seeds.');
    }
  };

  // --- FILTERED DATA ---
  const filteredEvents = [
    ...upcomingEvents.map(e => ({ ...e, isUpcoming: true })),
    ...pastEvents.map(e => ({ ...e, isUpcoming: false }))
  ].filter(evt => {
    if (eventFilter === 'upcoming' && !evt.isUpcoming) return false;
    if (eventFilter === 'past' && evt.isUpcoming) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title?.toLowerCase().includes(q);
      const matchDesc = evt.description?.toLowerCase().includes(q);
      const matchVenue = evt.venue?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchVenue;
    }
    return true;
  });

  const filteredProjects = projects.filter(proj => {
    if (projectStatusFilter !== 'all' && proj.status !== projectStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title?.toLowerCase().includes(q);
      const matchDomain = proj.domain?.toLowerCase().includes(q);
      const matchMentor = proj.facultyMentor?.toLowerCase().includes(q);
      return matchTitle || matchDomain || matchMentor;
    }
    return true;
  });

  const filteredFaculty = faculty.filter(fac => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = fac.name?.toLowerCase().includes(q);
      const matchDept = fac.department?.toLowerCase().includes(q);
      const matchDomain = fac.domain?.toLowerCase().includes(q);
      return matchName || matchDept || matchDomain;
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const filteredMessages = messages.filter(msg => {
    if (messageFilter === 'unread' && msg.read) return false;
    if (messageFilter === 'read' && !msg.read) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchComment = msg.comment?.toLowerCase().includes(q);
      return matchName || matchEmail || matchComment;
    }
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-header-icon">
            <Lock size={32} />
          </div>
          <h2 className="login-title">Admin Portal Sign In</h2>
          <p className="login-subtitle">
            Restricted access. Please enter your administrator email and password to manage the portal.
          </p>

          {loginError && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Administrator Email</label>
              <input 
                type="email" 
                className="form-control" 
                required
                placeholder="admin@srmist.edu.in"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setLoginError(null); }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control" 
                  required
                  placeholder="Enter administrator password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(null); }}
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-btn admin-btn-primary" 
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1.25rem' }}
            >
              <ShieldCheck size={18} /> Sign In to Admin Portal
            </button>
          </form>

          <div className="credential-helper-box">
            <div>Default administrator login:</div>
            <div style={{ marginTop: '0.25rem' }}>Email: <span className="code-pill">{adminCredentials?.email || 'admin@srmist.edu.in'}</span></div>
            <div style={{ marginTop: '0.25rem' }}>Password: <span className="code-pill">{adminCredentials?.password || 'admin'}</span></div>
            <button 
              type="button" 
              className="btn-autofill"
              onClick={() => {
                setLoginEmail(adminCredentials?.email || 'admin@srmist.edu.in');
                setLoginPassword(adminCredentials?.password || 'admin');
                setLoginError(null);
              }}
            >
              Auto-fill default credentials
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Return to Public Website
            </Link>
          </div>
        </div>

        {toastMessage && (
          <div className="admin-toast-container">
            <div className="admin-toast">
              <Check size={20} color="#20c997" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        
        {/* Admin Header Card */}
        <div className="admin-header-card">
          <div className="admin-header-top">
            <div>
              <div className="admin-badge">
                <ShieldCheck size={16} /> Admin Command Center
              </div>
              <h1 className="admin-title">Geospatial SRM Admin Portal</h1>
              <p className="admin-subtitle">
                Manage upcoming events, completed activities, current projects, faculty mentors, and overall club details in real time. Changes immediately update the live website and persist in local storage.
              </p>
            </div>
            
            <div className="admin-header-actions">
              <Link to="/" className="admin-btn admin-btn-outline-light" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} /> View Live Site
              </Link>
              <button className="admin-btn admin-btn-outline-light" onClick={exportDataJSON} title="Download JSON Backup">
                <Download size={16} /> Export JSON
              </button>
              <label htmlFor={fileInputId} className="admin-btn admin-btn-outline-light" style={{ cursor: 'pointer' }} title="Import JSON backup">
                <Upload size={16} /> Import JSON
              </label>
              <input 
                id={fileInputId} 
                type="file" 
                accept=".json" 
                onChange={handleImportFile} 
                style={{ display: 'none' }} 
              />
              <button className="admin-btn admin-btn-danger-outline" onClick={handleReset} title="Reset to initial data">
                <RotateCcw size={16} /> Reset Defaults
              </button>
              <button className="admin-btn admin-btn-danger-outline" onClick={handleLogout} title="Sign Out of Admin Portal">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>

          {/* Quick Stats Counter */}
          <div className="admin-stats-row">
            <div className="admin-stat-pill">
              <div className="stat-icon-wrapper">
                <Calendar size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-num">{upcomingEvents.length}</div>
                <div className="stat-desc">Upcoming Events</div>
              </div>
            </div>

            <div className="admin-stat-pill">
              <div className="stat-icon-wrapper">
                <CheckCircle size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-num">{pastEvents.length}</div>
                <div className="stat-desc">Completed Events</div>
              </div>
            </div>

            <div className="admin-stat-pill">
              <div className="stat-icon-wrapper">
                <FolderGit2 size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-num">{projects.length}</div>
                <div className="stat-desc">Active Projects</div>
              </div>
            </div>

            <div className="admin-stat-pill">
              <div className="stat-icon-wrapper">
                <GraduationCap size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-num">{faculty.length}</div>
                <div className="stat-desc">Faculty Mentors</div>
              </div>
            </div>

            <div className="admin-stat-pill">
              <div className="stat-icon-wrapper">
                <MessageSquare size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-num">{messages.length}</div>
                <div className="stat-desc">Inquiries ({unreadCount} new)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-nav">
          <button 
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setSearchQuery(''); }}
          >
            <Calendar size={18} />
            Events (Upcoming & Done)
            <span className="tab-count">{upcomingEvents.length + pastEvents.length}</span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
          >
            <FolderGit2 size={18} />
            Projects
            <span className="tab-count">{projects.length}</span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => { setActiveTab('faculty'); setSearchQuery(''); }}
          >
            <GraduationCap size={18} />
            Faculty Mentors
            <span className="tab-count">{faculty.length}</span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setSearchQuery(''); }}
          >
            <MessageSquare size={18} />
            Inquiries & Comments
            <span 
              className="tab-count" 
              style={unreadCount > 0 ? { backgroundColor: '#20c997', color: '#0a192f', fontWeight: 800 } : {}}
            >
              {messages.length} {unreadCount > 0 ? `(${unreadCount} new)` : ''}
            </span>
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
          >
            <Settings size={18} />
            Club Info & Everything
          </button>
        </div>

        {/* ================= EVENTS TAB ================= */}
        {activeTab === 'events' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search events by title, description, venue..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="subfilter-pills">
                  <button 
                    className={`subfilter-pill ${eventFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setEventFilter('all')}
                  >
                    All ({upcomingEvents.length + pastEvents.length})
                  </button>
                  <button 
                    className={`subfilter-pill ${eventFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setEventFilter('upcoming')}
                  >
                    Upcoming ({upcomingEvents.length})
                  </button>
                  <button 
                    className={`subfilter-pill ${eventFilter === 'past' ? 'active' : ''}`}
                    onClick={() => setEventFilter('past')}
                  >
                    Completed / Done ({pastEvents.length})
                  </button>
                </div>
              </div>

              <button className="btn-create" onClick={handleOpenAddEvent}>
                <Plus size={18} /> Create Event
              </button>
            </div>

            <div className="admin-card-grid">
              {filteredEvents.map(evt => (
                <div key={evt.id} className="admin-item-card">
                  <div className="item-thumb-wrapper">
                    <img src={evt.image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={evt.title} className="item-thumb" />
                    <span className={`status-badge-chip ${evt.isUpcoming ? 'upcoming' : 'done'}`}>
                      {evt.isUpcoming ? 'Upcoming' : 'Completed / Done'}
                    </span>
                  </div>

                  <div className="item-body">
                    <h3 className="item-title">{evt.title}</h3>
                    <div className="item-meta-list">
                      {evt.date && (
                        <div className="meta-row">
                          <Calendar size={15} color="#20c997" /> <span>{evt.date}</span>
                        </div>
                      )}
                      {evt.time && (
                        <div className="meta-row">
                          <Clock size={15} color="#20c997" /> <span>{evt.time}</span>
                        </div>
                      )}
                      {evt.venue && (
                        <div className="meta-row">
                          <MapPin size={15} color="#20c997" /> <span>{evt.venue}</span>
                        </div>
                      )}
                    </div>
                    <p className="item-desc">{evt.description}</p>

                    <div className="item-actions">
                      <button 
                        className="action-status-toggle"
                        onClick={() => handleToggleEventStatus(evt.id, evt.title)}
                        title={evt.isUpcoming ? "Mark event as Completed/Done" : "Mark event as Upcoming"}
                      >
                        <ArrowRightLeft size={14} />
                        {evt.isUpcoming ? 'Mark as Done' : 'Move to Upcoming'}
                      </button>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditEvent(evt, evt.isUpcoming)}
                          title="Edit Event"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteEvent(evt.id, evt.isUpcoming, evt.title)}
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No events found matching your criteria.</p>
                  <button className="btn-create" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddEvent}>
                    <Plus size={18} /> Create First Event
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search projects by title, domain, mentor..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="subfilter-pills">
                  <button 
                    className={`subfilter-pill ${projectStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setProjectStatusFilter('all')}
                  >
                    All ({projects.length})
                  </button>
                  <button 
                    className={`subfilter-pill ${projectStatusFilter === 'Ongoing' ? 'active' : ''}`}
                    onClick={() => setProjectStatusFilter('Ongoing')}
                  >
                    Ongoing
                  </button>
                  <button 
                    className={`subfilter-pill ${projectStatusFilter === 'Completed' ? 'active' : ''}`}
                    onClick={() => setProjectStatusFilter('Completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <button className="btn-create" onClick={handleOpenAddProject}>
                <Plus size={18} /> Create Project
              </button>
            </div>

            <div className="admin-card-grid">
              {filteredProjects.map(proj => (
                <div key={proj.id} className="admin-item-card">
                  <div className="item-thumb-wrapper">
                    <img src={proj.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={proj.title} className="item-thumb" />
                    <span className="status-badge-chip ongoing">
                      {proj.status}
                    </span>
                  </div>

                  <div className="item-body">
                    <div style={{ color: '#20c997', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      {proj.domain}
                    </div>
                    <h3 className="item-title">{proj.title}</h3>
                    
                    <div className="item-meta-list">
                      <div className="meta-row">
                        <Activity size={15} color="#20c997" />
                        <span><strong>Mentor:</strong> {proj.facultyMentor}</span>
                      </div>
                      <div className="meta-row">
                        <Users size={15} color="#20c997" />
                        <span><strong>Team:</strong> {proj.studentTeam}</span>
                      </div>
                    </div>

                    <p className="item-desc">{proj.description}</p>

                    {proj.technologies && (
                      <div className="item-tags">
                        {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((tech, i) => (
                          <span key={i} className="item-tag">{tech}</span>
                        ))}
                      </div>
                    )}

                    <div className="item-actions">
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        ID: {proj.id}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditProject(proj)}
                          title="Edit Project"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No projects found.</p>
                  <button className="btn-create" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddProject}>
                    <Plus size={18} /> Add New Project
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= FACULTY TAB ================= */}
        {activeTab === 'faculty' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search faculty by name, department, expertise..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-create" onClick={handleOpenAddFaculty}>
                <Plus size={18} /> Add Faculty Member
              </button>
            </div>

            <div className="admin-card-grid">
              {filteredFaculty.map(fac => (
                <div key={fac.id} className="admin-item-card">
                  <div className="item-body">
                    <div className="faculty-card-header">
                      <img src={fac.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={fac.name} className="faculty-avatar" />
                      <div className="faculty-info-text">
                        <div className="faculty-name">{fac.name}</div>
                        <div className="faculty-desig">{fac.designation}</div>
                        <div className="faculty-dept">{fac.department}</div>
                      </div>
                    </div>

                    <div className="item-meta-list">
                      {fac.email && (
                        <div className="meta-row">
                          <Mail size={15} color="#20c997" />
                          <span>{fac.email}</span>
                        </div>
                      )}
                      {fac.domain && (
                        <div className="meta-row">
                          <Globe size={15} color="#20c997" />
                          <span><strong>Domain:</strong> {fac.domain}</span>
                        </div>
                      )}
                      {fac.office && (
                        <div className="meta-row">
                          <MapPin size={15} color="#20c997" />
                          <span><strong>Office:</strong> {fac.office}</span>
                        </div>
                      )}
                    </div>

                    {fac.bio && (
                      <p className="item-desc" style={{ marginTop: '0.5rem' }}>
                        {fac.bio}
                      </p>
                    )}

                    <div className="item-actions">
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        ID: {fac.id}
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditFaculty(fac)}
                          title="Edit Faculty"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                          title="Delete Faculty"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFaculty.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No faculty profiles found.</p>
                  <button className="btn-create" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddFaculty}>
                    <Plus size={18} /> Add Faculty Member
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MESSAGES & INQUIRIES TAB ================= */}
        {activeTab === 'messages' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search messages by name, @srmist email, or comments..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="subfilter-pills">
                  <button 
                    className={`subfilter-pill ${messageFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('all')}
                  >
                    All ({messages.length})
                  </button>
                  <button 
                    className={`subfilter-pill ${messageFilter === 'unread' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('unread')}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button 
                    className={`subfilter-pill ${messageFilter === 'read' ? 'active' : ''}`}
                    onClick={() => setMessageFilter('read')}
                  >
                    Read ({messages.length - unreadCount})
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className="admin-item-card"
                  style={{
                    padding: '1.75rem',
                    borderLeft: msg.read ? '4px solid #cbd5e1' : '4px solid #20c997',
                    backgroundColor: msg.read ? '#ffffff' : '#f0fdfa',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0a192f', margin: 0 }}>
                          {msg.name}
                        </h3>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: 700, 
                          color: '#065f46', 
                          background: '#d1fae5', 
                          padding: '0.25rem 0.65rem', 
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <Check size={13} /> {msg.email}
                        </span>
                        {!msg.read && (
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            color: '#ffffff', 
                            background: '#20c997', 
                            padding: '0.2rem 0.55rem', 
                            borderRadius: '10px' 
                          }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
                        Received: {msg.timestamp}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <button 
                        className="admin-btn admin-btn-outline-light"
                        style={{ color: '#0a192f', borderColor: '#cbd5e1', fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                        onClick={() => {
                          markMessageAsRead(msg.id);
                          showToast('Message marked as read.');
                        }}
                      >
                        {msg.read ? 'Marked as Read' : 'Mark as Read'}
                      </button>
                      <a 
                        href={`mailto:${msg.email}?subject=Response from Geospatial Computing Research Vertical SRMIST&body=Hi ${msg.name},%0D%0A%0D%0AThank you for contacting the Geospatial Computing Research Vertical regarding:%0D%0A"${msg.comment}"%0D%0A%0D%0A`}
                        className="admin-btn admin-btn-primary"
                        style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
                      >
                        <Mail size={15} /> Reply via Email
                      </a>
                      <button 
                        className="btn-icon-action delete"
                        onClick={() => {
                          if (window.confirm(`Delete message from ${msg.name}?`)) {
                            deleteMessage(msg.id);
                            showToast('Message deleted.');
                          }
                        }}
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '1.2rem 1.4rem', 
                    borderRadius: '8px', 
                    fontSize: '0.98rem', 
                    color: '#334155',
                    lineHeight: '1.6',
                    border: '1px solid #e2e8f0',
                    fontStyle: 'italic'
                  }}>
                    "{msg.comment}"
                  </div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <MessageSquare size={42} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#64748b', fontSize: '1.15rem', fontWeight: 600 }}>No inquiries found.</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                    Messages sent from the public website via the "Contact" button will arrive here in real time.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= CLUB INFO & SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="settings-container">
            <form onSubmit={handleSaveSettings}>
              
              {/* Club Identity Section */}
              <div className="settings-section-card" style={{ marginBottom: '1.5rem' }}>
                <div className="settings-section-header">
                  <h2 className="settings-section-title">Club Identity & Overview</h2>
                  <p className="settings-section-desc">Basic names, institution header, and banner descriptions displayed on the Home and About pages.</p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Club Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsFormData.name}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Institution</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={settingsFormData.institution}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, institution: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tagline</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={settingsFormData.tagline}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, tagline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Hero Description (Home Page Header)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={settingsFormData.heroDescription}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, heroDescription: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>About Club Description (About Page)</label>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    value={settingsFormData.aboutDescription}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, aboutDescription: e.target.value })}
                  />
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="settings-section-card" style={{ marginBottom: '1.5rem' }}>
                <div className="settings-section-header">
                  <h2 className="settings-section-title">Vision & Mission</h2>
                  <p className="settings-section-desc">Strategic objectives highlighted across the site.</p>
                </div>

                <div className="form-group">
                  <label>Club Vision</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={settingsFormData.vision}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, vision: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Club Mission</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={settingsFormData.mission}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, mission: e.target.value })}
                  />
                </div>
              </div>

              {/* Live Statistics Counter Values */}
              <div className="settings-section-card" style={{ marginBottom: '1.5rem' }}>
                <div className="settings-section-header">
                  <h2 className="settings-section-title">Club Key Statistics</h2>
                  <p className="settings-section-desc">Numerical stats shown on the Home page banner.</p>
                </div>

                <div className="stats-editor-grid">
                  {settingsFormData.stats.map((stat, idx) => (
                    <div key={idx} className="stat-edit-box">
                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label>Stat Metric Label</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={stat.label}
                          onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Display Value</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={stat.value}
                          onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Security & Credentials Section */}
              <div className="settings-section-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #20c997' }}>
                <div className="settings-section-header">
                  <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={20} color="#20c997" /> Admin Login & Security Credentials
                  </h2>
                  <p className="settings-section-desc">
                    Customize the administrator email address and password required to unlock this portal at /admin.
                  </p>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Administrator Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={securityEmail}
                      onChange={(e) => setSecurityEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Administrator Password</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={securityPassword}
                      onChange={(e) => setSecurityPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-primary" 
                    style={{ fontSize: '0.88rem' }}
                    onClick={handleSaveSecurityCredentials}
                  >
                    <Key size={15} /> Update Admin Credentials
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                  <Check size={18} /> Save All Club Changes
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* ================= MODAL: EVENT (ADD / EDIT) ================= */}
      {eventModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setEventModalOpen(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="btn-close-modal" onClick={() => setEventModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveEvent}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Event Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="e.g. GeoAI & Smart Mapping Workshop"
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status / Category</label>
                  <select 
                    className="form-control"
                    value={eventFormData.statusType}
                    onChange={(e) => setEventFormData({ ...eventFormData, statusType: e.target.value })}
                  >
                    <option value="upcoming">Upcoming Event (Active)</option>
                    <option value="past">Completed / Done Event (Archive)</option>
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 20 November 2026"
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Time</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 10:00 AM – 1:00 PM"
                      value={eventFormData.time}
                      onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Venue / Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. SRMIST Tech Park Room 604"
                    value={eventFormData.venue}
                    onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows={4}
                    placeholder="Detailed explanation of the event objectives and activities..."
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Banner Image URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="https://images.unsplash.com/..."
                    value={eventFormData.image}
                    onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                  />
                  {eventFormData.image && (
                    <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '140px' }}>
                      <img src={eventFormData.image} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline-light" style={{ color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setEventModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROJECT (ADD / EDIT) ================= */}
      {projectModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setProjectModalOpen(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
              <button className="btn-close-modal" onClick={() => setProjectModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProject}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="e.g. Smart Urban Mapping"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Domain</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. GIS • Remote Sensing • GeoAI"
                      value={projectFormData.domain}
                      onChange={(e) => setProjectFormData({ ...projectFormData, domain: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      className="form-control"
                      value={projectFormData.status}
                      onChange={(e) => setProjectFormData({ ...projectFormData, status: e.target.value })}
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="In Review">In Review</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Faculty Mentor</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      list="faculty-options"
                      placeholder="e.g. Dr. Arun Kumar"
                      value={projectFormData.facultyMentor}
                      onChange={(e) => setProjectFormData({ ...projectFormData, facultyMentor: e.target.value })}
                    />
                    <datalist id="faculty-options">
                      {faculty.map(f => (
                        <option key={f.id} value={f.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label>Student Team</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. 5 Members (Lead: Jane Doe)"
                      value={projectFormData.studentTeam}
                      onChange={(e) => setProjectFormData({ ...projectFormData, studentTeam: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Short Description (Card view)</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    placeholder="Brief 1-2 sentence overview..."
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Project Overview (Modal view)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Comprehensive overview of the initiative..."
                    value={projectFormData.overview}
                    onChange={(e) => setProjectFormData({ ...projectFormData, overview: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Problem Statement</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    value={projectFormData.problemStatement}
                    onChange={(e) => setProjectFormData({ ...projectFormData, problemStatement: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Objectives (1 per line)</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Develop spatial framework&#10;Implement AI segmentation&#10;Publish open web portal"
                    value={projectFormData.objectives}
                    onChange={(e) => setProjectFormData({ ...projectFormData, objectives: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Methodology</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    value={projectFormData.methodology}
                    onChange={(e) => setProjectFormData({ ...projectFormData, methodology: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Technologies Used (comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="QGIS, Python, TensorFlow, PostGIS"
                    value={projectFormData.technologies}
                    onChange={(e) => setProjectFormData({ ...projectFormData, technologies: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Expected Outcome</label>
                  <textarea 
                    className="form-control" 
                    rows={2}
                    value={projectFormData.expectedOutcome}
                    onChange={(e) => setProjectFormData({ ...projectFormData, expectedOutcome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Project Cover Image URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    value={projectFormData.image}
                    onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                  />
                  {projectFormData.image && (
                    <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '140px' }}>
                      <img src={projectFormData.image} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline-light" style={{ color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setProjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FACULTY (ADD / EDIT) ================= */}
      {facultyModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setFacultyModalOpen(false)}>
          <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingFaculty ? 'Edit Faculty Mentor' : 'Add Faculty Member'}</h3>
              <button className="btn-close-modal" onClick={() => setFacultyModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveFaculty}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label>Full Name with Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="e.g. Dr. Arun Kumar"
                    value={facultyFormData.name}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Designation / Role</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Professor & Faculty Mentor"
                      value={facultyFormData.designation}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, designation: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Department of Remote Sensing & GIS"
                      value={facultyFormData.department}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="faculty@srmist.edu.in"
                      value={facultyFormData.email}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Office / Lab Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Tech Park 6th Floor, Room 604"
                      value={facultyFormData.office}
                      onChange={(e) => setFacultyFormData({ ...facultyFormData, office: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Research Domain / Expertise</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Spatial Data Science, GeoAI, Remote Sensing"
                    value={facultyFormData.domain}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, domain: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Bio / Background Summary</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Brief background and research achievements..."
                    value={facultyFormData.bio}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, bio: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    value={facultyFormData.image}
                    onChange={(e) => setFacultyFormData({ ...facultyFormData, image: e.target.value })}
                  />
                  {facultyFormData.image && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={facultyFormData.image} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Avatar preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline-light" style={{ color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setFacultyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingFaculty ? 'Save Changes' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="admin-toast-container">
          <div className="admin-toast">
            <Check size={20} color="#20c997" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
