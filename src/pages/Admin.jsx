import React, { useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Users, Activity, Plus, Edit3, Trash2, 
  CheckCircle, ArrowRightLeft, Sparkles, Download, Upload, RotateCcw, 
  Search, ExternalLink, GraduationCap, FolderGit2, Settings, ShieldCheck,
  Check, Mail, Globe, Map, Lock, LogOut, Eye, EyeOff, AlertCircle, ArrowLeft, Key, MessageSquare,
  FileSpreadsheet, UserCheck, Filter, Menu, LayoutDashboard, ClipboardList, ChevronRight
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
    registrations = [],
    deleteRegistration,
    exportRegistrationsExcel,
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

  // SRM Portal Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // events | registrations | projects | faculty | messages | settings
  const [eventFilter, setEventFilter] = useState('all'); // all | upcoming | past
  const [projectStatusFilter, setProjectStatusFilter] = useState('all'); // all | Ongoing | Completed
  const [messageFilter, setMessageFilter] = useState('all'); // all | unread | read
  const [selectedRegEventFilter, setSelectedRegEventFilter] = useState('all'); // all | eventId
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Event Roster Inspection Modal State
  const [rosterModalEvent, setRosterModalEvent] = useState(null);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');

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
    statusType: 'upcoming',
    registrationType: 'form',
    registrationLink: '',
    registrationOpen: true
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
      statusType: 'upcoming',
      registrationType: 'form',
      registrationLink: '',
      registrationOpen: true
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
      statusType: isUpcoming ? 'upcoming' : 'past',
      registrationType: evt.registrationType || 'form',
      registrationLink: evt.registrationLink || '',
      registrationOpen: evt.registrationOpen !== false
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) {
      alert('Event title is required');
      return;
    }

    const eventPayload = {
      title: eventFormData.title,
      date: eventFormData.date,
      time: eventFormData.time,
      venue: eventFormData.venue,
      description: eventFormData.description,
      image: eventFormData.image,
      registrationType: eventFormData.registrationType,
      registrationLink: eventFormData.registrationLink,
      registrationOpen: eventFormData.registrationOpen
    };

    if (editingEvent) {
      const isCurrentlyUpcoming = editingEvent.isUpcoming;
      const targetIsUpcoming = eventFormData.statusType === 'upcoming';

      if (isCurrentlyUpcoming === targetIsUpcoming) {
        updateEvent(editingEvent.id, eventPayload, targetIsUpcoming);
      } else {
        deleteEvent(editingEvent.id, isCurrentlyUpcoming);
        addEvent({
          id: editingEvent.id,
          ...eventPayload
        }, targetIsUpcoming);
      }
      showToast(`Event "${eventFormData.title}" updated successfully!`);
    } else {
      addEvent(eventPayload, eventFormData.statusType === 'upcoming');
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

  const filteredRegistrations = registrations.filter(reg => {
    if (selectedRegEventFilter !== 'all' && reg.eventId !== selectedRegEventFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (reg.name || reg.fullName)?.toLowerCase().includes(q);
      const matchRegNo = (reg.registerNumber || reg.regNumber)?.toLowerCase().includes(q);
      const matchEmail = reg.email?.toLowerCase().includes(q);
      const matchDept = reg.department?.toLowerCase().includes(q);
      const matchEvent = reg.eventTitle?.toLowerCase().includes(q);
      const matchId = reg.id?.toLowerCase().includes(q);
      return matchName || matchRegNo || matchEmail || matchDept || matchEvent || matchId;
    }
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-header-emblem">SRM</div>
          <h2 className="login-title">SRM Student Portal</h2>
          <div style={{ textAlign: 'center', fontSize: '0.86rem', color: '#1c4482', fontWeight: 700, marginBottom: '0.35rem' }}>
            Faculty of Engineering and Technology, Kattankulathur
          </div>
          <p className="login-subtitle">
            Geospatial Computing Research Vertical • Admin Authentication
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
              className="srm-btn-primary" 
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.98rem', marginTop: '1.25rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={18} /> Sign In to SRM Portal
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
            <Link to="/" style={{ color: '#64748b', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
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
    <div className="srm-portal-wrapper">
      {/* Top Navigation Bar (sp.srmist.edu.in style) */}
      <header className="srm-topbar">
        <div className="srm-topbar-left">
          <button 
            type="button" 
            className="srm-hamburger-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="srm-logo-block">
            <span className="srm-brand-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--srm-navy)' }}>
              Geospatial Computing Research Vertical
            </span>
          </div>
        </div>

        <div className="srm-topbar-right">
          <Link to="/" className="srm-topbar-link" target="_blank" rel="noopener noreferrer" title="View Public Website">
            <ExternalLink size={14} /> <span>View Site</span>
          </Link>
          <button className="srm-topbar-link" onClick={exportDataJSON} title="Download JSON Backup">
            <Download size={14} /> <span>Export JSON</span>
          </button>
          <label htmlFor={fileInputId} className="srm-topbar-link" style={{ cursor: 'pointer' }} title="Import JSON backup">
            <Upload size={14} /> <span>Import</span>
          </label>
          <input 
            id={fileInputId} 
            type="file" 
            accept=".json" 
            onChange={handleImportFile} 
            style={{ display: 'none' }} 
          />
          <button className="srm-topbar-link" onClick={handleReset} title="Reset Defaults">
            <RotateCcw size={14} /> <span>Reset</span>
          </button>
          <button className="srm-logout-btn" onClick={handleLogout} title="Sign Out of Portal">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Body: Left Sidebar + Main Viewport */}
      <div className="srm-portal-body">
        {/* Left Sidebar */}
        <aside className={`srm-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="srm-sidebar-nav">
            <button 
              className={`srm-nav-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => { setActiveTab('events'); setSearchQuery(''); }}
              title="Events Management"
            >
              <Calendar size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Events Management</span>
              <span className="srm-pill-badge">{upcomingEvents.length + pastEvents.length}</span>
            </button>

            <button 
              className={`srm-nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => { setActiveTab('registrations'); setSearchQuery(''); }}
              title="Event Registrations & Live Excel Export"
            >
              <ClipboardList size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Event Registrations</span>
              <span className="srm-pill-badge highlight">{registrations.length}</span>
            </button>

            <button 
              className={`srm-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
              title="Research Projects"
            >
              <FolderGit2 size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Research Projects</span>
              <span className="srm-pill-badge">{projects.length}</span>
            </button>

            <button 
              className={`srm-nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
              onClick={() => { setActiveTab('faculty'); setSearchQuery(''); }}
              title="Faculty Mentors"
            >
              <GraduationCap size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Faculty Mentors</span>
              <span className="srm-pill-badge">{faculty.length}</span>
            </button>

            <button 
              className={`srm-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => { setActiveTab('messages'); setSearchQuery(''); }}
              title="Inquiries & Comments"
            >
              <MessageSquare size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Inquiries & Feedback</span>
              {unreadCount > 0 && <span className="srm-pill-badge alert">{unreadCount}</span>}
            </button>

            <button 
              className={`srm-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
              title="Vertical Settings"
            >
              <Settings size={18} className="srm-nav-icon" />
              <span className="srm-nav-text">Vertical Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="srm-main-viewport">
          {/* Professional Page Header (Title + Subtitle + Single Primary Action) */}
          <div className="srm-page-header">
            <div>
              <div className="srm-breadcrumb">
                <span>SRMIST Admin</span>
                <span className="sep">/</span>
                <span className="current">
                  {activeTab === 'events' && 'Events'}
                  {activeTab === 'registrations' && 'Registrations'}
                  {activeTab === 'projects' && 'Projects'}
                  {activeTab === 'faculty' && 'Faculty'}
                  {activeTab === 'messages' && 'Inquiries'}
                  {activeTab === 'settings' && 'Settings'}
                </span>
              </div>
              <h1 className="srm-page-title">
                {activeTab === 'events' && 'Events Management'}
                {activeTab === 'registrations' && 'Event Registrations & Live Database'}
                {activeTab === 'projects' && 'Research Projects & Initiatives'}
                {activeTab === 'faculty' && 'Faculty Mentors & Advisory Panel'}
                {activeTab === 'messages' && 'Student Inquiries & Feedback'}
                {activeTab === 'settings' && 'Vertical Configuration & Settings'}
              </h1>
              <p className="srm-page-subtitle">
                {activeTab === 'events' && 'Create, edit, and organize departmental workshops, hackathons, and activities.'}
                {activeTab === 'registrations' && 'Live roster of registered SRMIST students with instant Microsoft Excel export.'}
                {activeTab === 'projects' && 'Manage department research projects, domains, faculty mentors, and student teams.'}
                {activeTab === 'faculty' && 'Manage faculty mentors, department affiliations, and research areas.'}
                {activeTab === 'messages' && 'Review queries and comments submitted through the public website contact modal.'}
                {activeTab === 'settings' && 'Configure club identity, vision, mission, homepage statistics, and security credentials.'}
              </p>
            </div>

            <div className="srm-header-actions">
              {activeTab === 'events' && (
                <button className="srm-btn-primary" onClick={handleOpenAddEvent}>
                  <Plus size={16} /> Create Event
                </button>
              )}
              {activeTab === 'registrations' && (
                <button 
                  type="button"
                  className="srm-btn-excel"
                  onClick={() => {
                    exportRegistrationsExcel(selectedRegEventFilter === 'all' ? null : selectedRegEventFilter);
                    showToast('Live Excel sheet downloaded successfully!');
                  }}
                  disabled={filteredRegistrations.length === 0}
                  style={{ opacity: filteredRegistrations.length === 0 ? 0.6 : 1 }}
                  title="Download as Microsoft Excel (.xlsx) file"
                >
                  <FileSpreadsheet size={16} /> Download Excel (.xlsx)
                </button>
              )}
              {activeTab === 'projects' && (
                <button className="srm-btn-primary" onClick={handleOpenAddProject}>
                  <Plus size={16} /> Create Project
                </button>
              )}
              {activeTab === 'faculty' && (
                <button className="srm-btn-primary" onClick={handleOpenAddFaculty}>
                  <Plus size={16} /> Add Faculty Member
                </button>
              )}
            </div>
          </div>

        {/* ================= EVENTS TAB ================= */}
        {activeTab === 'events' && (
          <div className="srm-card">
            <div className="srm-card-header">
              <div className="srm-card-header-title">
                <Calendar size={18} />
                <span>Events Directory</span>
              </div>
              <span className="srm-pill-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                {upcomingEvents.length + pastEvents.length} Total
              </span>
            </div>

            <div className="srm-card-body">
              <div className="srm-toolbar">
                <div className="toolbar-left">
                  <div className="srm-search-input-wrap">
                    <Search size={16} />
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
                      Completed ({pastEvents.length})
                    </button>
                  </div>
                </div>
              </div>

            <div className="admin-card-grid">
              {filteredEvents.map(evt => (
                <div key={evt.id} className="admin-item-card">
                  <div className="item-thumb-wrapper">
                    <img src={evt.image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={evt.title} className="item-thumb" />
                    <span className={`status-badge-chip ${evt.isUpcoming ? 'upcoming' : 'done'}`}>
                      {evt.isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>

                  <div className="item-body">
                    <h3 className="item-title">{evt.title}</h3>
                    <div className="item-meta-list">
                      {evt.date && (
                        <div className="meta-row">
                          <Calendar size={15} color="#205493" /> <span>{evt.date}</span>
                        </div>
                      )}
                      {evt.time && (
                        <div className="meta-row">
                          <Clock size={15} color="#205493" /> <span>{evt.time}</span>
                        </div>
                      )}
                      {evt.venue && (
                        <div className="meta-row">
                          <MapPin size={15} color="#205493" /> <span>{evt.venue}</span>
                        </div>
                      )}
                    </div>
                    <p className="item-desc">{evt.description}</p>

                    {/* Registration Status & Attendee Count */}
                    <div style={{
                      marginTop: '0.5rem',
                      marginBottom: '0.65rem',
                      padding: '0.55rem 0.75rem',
                      background: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.4rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '10px',
                          background: '#eff6ff',
                          color: '#1c4482',
                          border: '1px solid #bfdbfe'
                        }}>
                          {evt.registrationType === 'link' ? 'External Link' : 'On-Site Form'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#1c4482', fontWeight: 600 }}>
                          {registrations.filter(r => r.eventId === evt.id).length} Registered
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            exportRegistrationsExcel(evt.id);
                            showToast(`Excel downloaded for ${evt.title}`);
                          }}
                          className="srm-btn-excel-sm"
                          disabled={registrations.filter(r => r.eventId === evt.id).length === 0}
                          title="Download registered students Excel sheet (.xlsx) for this event"
                        >
                          <FileSpreadsheet size={13} /> Excel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRosterModalEvent(evt);
                            setRosterSearchQuery('');
                          }}
                          className="srm-btn-outline-sm"
                          title="Go inside event to view registered students"
                        >
                          <Users size={13} /> Roster ({registrations.filter(r => r.eventId === evt.id).length})
                        </button>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="action-status-toggle"
                        onClick={() => handleToggleEventStatus(evt.id, evt.title)}
                        title={evt.isUpcoming ? "Mark event as Completed/Done" : "Mark event as Upcoming"}
                      >
                        <ArrowRightLeft size={13} />
                        {evt.isUpcoming ? 'Mark Done' : 'Set Upcoming'}
                      </button>

                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <a 
                          href={`/events/${evt.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon-action"
                          title="Open public registration page in new tab"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditEvent(evt, evt.isUpcoming)}
                          title="Edit Event"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteEvent(evt.id, evt.isUpcoming, evt.title)}
                          title="Delete Event"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No events found matching your criteria.</p>
                  <button className="srm-btn-primary" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddEvent}>
                    <Plus size={16} /> Create First Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= REGISTRATIONS & LIVE EXCEL TAB ================= */}
      {activeTab === 'registrations' && (
        <div className="srm-card">
          <div className="srm-card-header">
            <div className="srm-card-header-title">
              <ClipboardList size={18} />
              <span>Live Student Registrations Database</span>
            </div>
            <span className="srm-pill-badge highlight">
              {registrations.length} Total Registered
            </span>
          </div>

          <div className="srm-card-body">
            {/* Event Cards Grid for Direct Roster Inspection & Excel Download */}
            <div className="event-roster-section">
              <div className="event-roster-section-header">
                <div>
                  <h3 className="event-roster-section-title">
                    <Calendar size={18} color="#002b66" />
                    Event Rosters & Excel Exports
                  </h3>
                  <p className="event-roster-section-desc">
                    Click any event card below to go inside, view registered students, or download its Excel (.xlsx) roster.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    className="srm-btn-excel"
                    onClick={() => {
                      exportRegistrationsExcel(null);
                      showToast('Complete Master Excel roster downloaded successfully!');
                    }}
                    disabled={registrations.length === 0}
                    title="Download complete roster of all events combined as Excel"
                  >
                    <FileSpreadsheet size={16} /> Download All Registrations ({registrations.length})
                  </button>
                </div>
              </div>

              <div className="event-roster-grid">
                {/* Master All Events Card */}
                <div 
                  className={`event-roster-card all-events-card ${selectedRegEventFilter === 'all' ? 'active-filter' : ''}`}
                  onClick={() => setSelectedRegEventFilter('all')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-roster-card-header">
                    <div>
                      <h4 className="event-roster-card-title">All Events Master Roster</h4>
                      <div className="event-roster-card-meta">
                        <span>All {upcomingEvents.length + pastEvents.length} department events combined</span>
                      </div>
                    </div>
                    <span className="status-badge-chip ongoing" style={{ position: 'static' }}>All Events</span>
                  </div>

                  <div className="event-roster-count-strip">
                    <span className="event-roster-count-text">
                      <Users size={14} /> Total Attendees:
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{registrations.length} Students</strong>
                  </div>

                  <div className="event-roster-card-actions">
                    <button
                      type="button"
                      className="srm-btn-excel-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportRegistrationsExcel(null);
                        showToast('Complete Master Excel roster downloaded successfully!');
                      }}
                      disabled={registrations.length === 0}
                      title="Download Master Excel (.xlsx)"
                    >
                      <FileSpreadsheet size={13} /> Download Excel
                    </button>
                    <button
                      type="button"
                      className="srm-btn-outline-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegEventFilter('all');
                      }}
                      style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
                      title="View all in table below"
                    >
                      <Eye size={13} /> View in Table
                    </button>
                  </div>
                </div>

                {/* Individual Event Cards */}
                {[...upcomingEvents.map(e => ({ ...e, isUpcoming: true })), ...pastEvents.map(e => ({ ...e, isUpcoming: false }))].map(evt => {
                  const evtRegs = registrations.filter(r => r.eventId === evt.id);
                  const isSelected = selectedRegEventFilter === evt.id;

                  return (
                    <div 
                      key={evt.id} 
                      className={`event-roster-card ${isSelected ? 'active-filter' : ''}`}
                      onClick={() => setSelectedRegEventFilter(evt.id)}
                      title="Click to view inside table or click buttons below"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="event-roster-card-header">
                        <div style={{ flex: 1, paddingRight: '0.4rem' }}>
                          <h4 className="event-roster-card-title">{evt.title}</h4>
                          <div className="event-roster-card-meta">
                            {evt.date && (
                              <span className="event-roster-card-meta-item">
                                <Calendar size={13} color="#1a569d" /> {evt.date}
                              </span>
                            )}
                            {evt.venue && (
                              <span className="event-roster-card-meta-item">
                                <MapPin size={13} color="#1a569d" /> {evt.venue}
                              </span>
                            )}
                          </div>
                        </div>
                        <span 
                          className={`status-badge-chip ${evt.isUpcoming ? 'upcoming' : 'done'}`}
                          style={{ position: 'static', flexShrink: 0 }}
                        >
                          {evt.isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>

                      <div className="event-roster-count-strip">
                        <span className="event-roster-count-text">
                          <Users size={14} /> Registered:
                        </span>
                        <strong style={{ color: '#1c4482', fontSize: '0.92rem' }}>
                          {evtRegs.length} {evtRegs.length === 1 ? 'Student' : 'Students'}
                        </strong>
                      </div>

                      <div className="event-roster-card-actions">
                        <button
                          type="button"
                          className="srm-btn-excel-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportRegistrationsExcel(evt.id);
                            showToast(`Excel downloaded for ${evt.title}`);
                          }}
                          disabled={evtRegs.length === 0}
                          title={`Download Excel (.xlsx) with ${evtRegs.length} students`}
                        >
                          <FileSpreadsheet size={13} /> Download Excel
                        </button>
                        <button
                          type="button"
                          className="srm-btn-outline-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRosterModalEvent(evt);
                            setRosterSearchQuery('');
                          }}
                          title="Open roster modal inside to view and download"
                        >
                          <Eye size={13} /> Open Roster ({evtRegs.length})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="srm-toolbar">
              <div className="toolbar-left">
                <div className="srm-search-input-wrap">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by student name, reg no, SRMIST email, department..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Filter size={15} color="#64748b" />
                  <select
                    className="form-control"
                    style={{ minWidth: '220px', padding: '0.45rem 0.8rem', fontSize: '0.86rem', background: '#ffffff' }}
                    value={selectedRegEventFilter}
                    onChange={(e) => setSelectedRegEventFilter(e.target.value)}
                  >
                    <option value="all">All Events ({registrations.length})</option>
                    {upcomingEvents.map(evt => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title} ({registrations.filter(r => r.eventId === evt.id).length})
                      </option>
                    ))}
                    {pastEvents.map(evt => (
                      <option key={evt.id} value={evt.id}>
                        [Past] {evt.title} ({registrations.filter(r => r.eventId === evt.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRegEventFilter !== 'all' && (
                  <button 
                    type="button"
                    className="subfilter-pill"
                    onClick={() => setSelectedRegEventFilter('all')}
                    style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Clear Filter ✕
                  </button>
                )}
              </div>

              <div className="toolbar-right">
                <button
                  type="button"
                  className="srm-btn-excel"
                  onClick={() => {
                    exportRegistrationsExcel(selectedRegEventFilter === 'all' ? null : selectedRegEventFilter);
                    showToast('Excel sheet downloaded successfully!');
                  }}
                  disabled={filteredRegistrations.length === 0}
                  style={{ opacity: filteredRegistrations.length === 0 ? 0.6 : 1 }}
                  title="Download registrations as Microsoft Excel (.xlsx)"
                >
                  <FileSpreadsheet size={16} />
                  {selectedRegEventFilter === 'all' 
                    ? `Download All Excel (${filteredRegistrations.length})` 
                    : `Download Event Excel (${filteredRegistrations.length})`}
                </button>
              </div>
            </div>

            {/* Quick summary strip */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '0.75rem 1.25rem', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0', 
              marginBottom: '1rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.88rem', color: '#475569' }}>
                Showing <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> total registrations
                {selectedRegEventFilter !== 'all' && (
                  <span> for event: <em>{upcomingEvents.find(e => e.id === selectedRegEventFilter)?.title || pastEvents.find(e => e.id === selectedRegEventFilter)?.title}</em></span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#1c4482', fontWeight: 600 }}>
                ✓ Real-time database synced with SRMIST email verification
              </div>
            </div>

            {/* Registrations Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px' }}>#</th>
                    <th>Reg ID</th>
                    <th>Event</th>
                    <th>Student Name</th>
                    <th>Register Number</th>
                    <th>SRMIST Email</th>
                    <th>Department & Year</th>
                    <th>Phone / WhatsApp</th>
                    <th>Registered At</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg, index) => (
                    <tr key={reg.id}>
                      <td style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                      <td>
                        <span className="badge-reg-id">{reg.id}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#1c4482', fontSize: '0.88rem' }}>{reg.eventTitle}</strong>
                      </td>
                      <td style={{ fontWeight: 600, color: '#1e293b' }}>
                        {reg.name || reg.fullName}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                        {reg.registerNumber || reg.regNumber}
                      </td>
                      <td>
                        <span className="badge-srm-email">
                          <Check size={12} /> {reg.email}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{reg.department || 'N/A'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{reg.year ? `Year ${reg.year}` : ''}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {reg.phone || 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {reg.registeredAt || 'N/A'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon-action delete"
                          onClick={() => {
                            if (window.confirm(`Delete registration for "${reg.name || reg.fullName}" (${reg.id})?`)) {
                              deleteRegistration(reg.id);
                              showToast(`Registration ${reg.id} deleted.`);
                            }
                          }}
                          title="Delete Registration"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRegistrations.length === 0 && (
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <Users size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#64748b', fontSize: '1.15rem', fontWeight: 600 }}>
                    {searchQuery ? 'No registrations match your search criteria.' : 'No registrations received yet.'}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '0.35rem', maxWidth: '520px', margin: '0.35rem auto 0' }}>
                    When students register for upcoming events through the on-site registration form on the public website, their submissions will automatically appear here in live time and can be exported as an Excel file.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= PROJECTS TAB ================= */}
      {activeTab === 'projects' && (
        <div className="srm-card">
          <div className="srm-card-header">
            <div className="srm-card-header-title">
              <FolderGit2 size={18} />
              <span>Research Projects Directory</span>
            </div>
            <span className="srm-pill-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              {projects.length} Total
            </span>
          </div>

          <div className="srm-card-body">
            <div className="srm-toolbar">
              <div className="toolbar-left">
                <div className="srm-search-input-wrap">
                  <Search size={16} />
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
                    <div style={{ color: '#205493', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      {proj.domain}
                    </div>
                    <h3 className="item-title">{proj.title}</h3>
                    
                    <div className="item-meta-list">
                      <div className="meta-row">
                        <Activity size={15} color="#205493" />
                        <span><strong>Mentor:</strong> {proj.facultyMentor}</span>
                      </div>
                      <div className="meta-row">
                        <Users size={15} color="#205493" />
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
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        ID: {proj.id}
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditProject(proj)}
                          title="Edit Project"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No projects found.</p>
                  <button className="srm-btn-primary" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddProject}>
                    <Plus size={16} /> Add First Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= FACULTY TAB ================= */}
      {activeTab === 'faculty' && (
        <div className="srm-card">
          <div className="srm-card-header">
            <div className="srm-card-header-title">
              <GraduationCap size={18} />
              <span>Faculty Mentors & Advisory Panel</span>
            </div>
            <span className="srm-pill-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              {faculty.length} Mentors
            </span>
          </div>

          <div className="srm-card-body">
            <div className="srm-toolbar">
              <div className="toolbar-left">
                <div className="srm-search-input-wrap">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search faculty by name, department, expertise..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
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
                          <Mail size={15} color="#205493" />
                          <span>{fac.email}</span>
                        </div>
                      )}
                      {fac.domain && (
                        <div className="meta-row">
                          <Globe size={15} color="#205493" />
                          <span><strong>Domain:</strong> {fac.domain}</span>
                        </div>
                      )}
                      {fac.office && (
                        <div className="meta-row">
                          <MapPin size={15} color="#205493" />
                          <span><strong>Office:</strong> {fac.office}</span>
                        </div>
                      )}
                    </div>

                    {fac.bio && (
                      <p className="item-desc" style={{ marginTop: '0.4rem' }}>
                        {fac.bio}
                      </p>
                    )}

                    <div className="item-actions">
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        ID: {fac.id}
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn-icon-action" 
                          onClick={() => handleOpenEditFaculty(fac)}
                          title="Edit Faculty"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="btn-icon-action delete" 
                          onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                          title="Delete Faculty"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFaculty.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No faculty profiles found.</p>
                  <button className="srm-btn-primary" style={{ margin: '1rem auto 0' }} onClick={handleOpenAddFaculty}>
                    <Plus size={16} /> Add First Faculty Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MESSAGES & INQUIRIES TAB ================= */}
      {activeTab === 'messages' && (
        <div className="srm-card">
          <div className="srm-card-header">
            <div className="srm-card-header-title">
              <MessageSquare size={18} />
              <span>Student Inquiries & Public Feedback</span>
            </div>
            {unreadCount > 0 ? (
              <span className="srm-pill-badge alert">{unreadCount} Unread</span>
            ) : (
              <span className="srm-pill-badge">All caught up</span>
            )}
          </div>

          <div className="srm-card-body">
            <div className="srm-toolbar">
              <div className="toolbar-left">
                <div className="srm-search-input-wrap">
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
                    borderLeft: msg.read ? '4px solid #cbd5e1' : '4px solid #205493',
                    backgroundColor: msg.read ? '#ffffff' : '#f0f7ff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1c4482', margin: 0 }}>
                          {msg.name}
                        </h3>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: 700, 
                          color: '#1c4482', 
                          background: '#e6f0fa', 
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
                            background: '#205493', 
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
                        className="srm-btn-primary"
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
        </div>
      )}

      {/* ================= CLUB INFO & SETTINGS TAB ================= */}
      {activeTab === 'settings' && (
        <div className="srm-card">
          <div className="srm-card-header">
            <div className="srm-card-header-title">
              <Settings size={18} />
              <span>Vertical Information & Security Settings</span>
            </div>
          </div>

          <div className="srm-card-body">
            <div className="settings-container">
              <form onSubmit={handleSaveSettings}>
                
                {/* Club Identity Section */}
                <div className="settings-section-card" style={{ marginBottom: '1.5rem' }}>
                  <div className="settings-section-header">
                    <h2 className="settings-section-title">Vertical Identity & Overview</h2>
                    <p className="settings-section-desc">Basic names, institution header, and banner descriptions displayed on the Home and About pages.</p>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Vertical Name</label>
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
                    <label>About Description (About Page)</label>
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
                    <label>Vision Statement</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={settingsFormData.vision}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, vision: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mission Statement</label>
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
                    <h2 className="settings-section-title">Key Statistics Counter</h2>
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
                <div className="settings-section-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #205493' }}>
                  <div className="settings-section-header">
                    <h2 className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c4482' }}>
                      <Key size={20} color="#205493" /> Admin Login & Security Credentials
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
                      className="srm-btn-primary" 
                      style={{ fontSize: '0.88rem' }}
                      onClick={handleSaveSecurityCredentials}
                    >
                      <Key size={15} /> Update Admin Credentials
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="submit" className="srm-btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                    <Check size={18} /> Save All Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

        </main>
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

                {/* Registration Mode Settings */}
                <div className="form-group" style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <label style={{ fontWeight: 700, color: '#0a192f', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <Users size={16} color="#205493" /> Registration Method (Upcoming Events)
                  </label>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    Choose whether students register via an on-site custom form (real-time Excel export) or an external Google Form / portal link.
                  </p>

                  <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                      <input 
                        type="radio" 
                        name="registrationType"
                        value="form"
                        checked={eventFormData.registrationType === 'form'}
                        onChange={() => setEventFormData({ ...eventFormData, registrationType: 'form' })}
                      />
                      <span>Custom Form on Website</span>
                    </label>

                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                      <input 
                        type="radio" 
                        name="registrationType"
                        value="link"
                        checked={eventFormData.registrationType === 'link'}
                        onChange={() => setEventFormData({ ...eventFormData, registrationType: 'link' })}
                      />
                      <span>External Form / Portal Link</span>
                    </label>
                  </div>

                  {eventFormData.registrationType === 'link' ? (
                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                        External Registration Link *
                      </label>
                      <input 
                        type="url"
                        className="form-control"
                        placeholder="https://forms.gle/... or https://portal.srmist.edu.in/..."
                        value={eventFormData.registrationLink}
                        onChange={(e) => setEventFormData({ ...eventFormData, registrationLink: e.target.value })}
                        required={eventFormData.registrationType === 'link'}
                      />
                      <small style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginTop: '0.35rem' }}>
                        Clicking "Register" on the website will redirect students to this external URL in a new tab.
                      </small>
                    </div>
                  ) : (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem', color: '#047857' }}>
                      ✓ <strong>Custom Web Form Enabled:</strong> Students can register directly using their SRMIST email. All entries are captured live and available for instant Excel (.xlsx) export.
                    </div>
                  )}
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

      {/* ================= EVENT ROSTER INSPECTION MODAL ================= */}
      {rosterModalEvent && (
        <div className="admin-modal-overlay" onClick={() => setRosterModalEvent(null)}>
          <div className="admin-modal-box wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header" style={{ background: '#002b66' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ClipboardList size={22} color="#38bdf8" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                    {rosterModalEvent.title} — Attendee Roster
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem', display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                    {rosterModalEvent.date && <span>📅 {rosterModalEvent.date}</span>}
                    {rosterModalEvent.time && <span>⏰ {rosterModalEvent.time}</span>}
                    {rosterModalEvent.venue && <span>📍 {rosterModalEvent.venue}</span>}
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                      👥 {registrations.filter(r => r.eventId === rosterModalEvent.id).length} Registered
                    </span>
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close-modal" 
                onClick={() => setRosterModalEvent(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: '1.25rem' }}>
              {/* Modal Top Bar: Prominent Excel Download Button + Live Search */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  className="srm-btn-excel"
                  onClick={() => {
                    exportRegistrationsExcel(rosterModalEvent.id);
                    showToast(`Excel roster downloaded for ${rosterModalEvent.title}`);
                  }}
                  disabled={registrations.filter(r => r.eventId === rosterModalEvent.id).length === 0}
                  style={{
                    fontSize: '0.92rem',
                    padding: '0.6rem 1.25rem'
                  }}
                >
                  <FileSpreadsheet size={18} /> Download Excel (.xlsx) Roster
                </button>

                <div className="srm-search-input-wrap" style={{ minWidth: '260px' }}>
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search students in this event..."
                    value={rosterSearchQuery}
                    onChange={(e) => setRosterSearchQuery(e.target.value)}
                  />
                  {rosterSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRosterSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Roster Table */}
              {(() => {
                const eventRegs = registrations.filter(r => r.eventId === rosterModalEvent.id);
                const displayedRegs = eventRegs.filter(r => {
                  if (!rosterSearchQuery.trim()) return true;
                  const q = rosterSearchQuery.toLowerCase();
                  return (
                    r.name?.toLowerCase().includes(q) ||
                    r.registerNumber?.toLowerCase().includes(q) ||
                    r.email?.toLowerCase().includes(q) ||
                    r.department?.toLowerCase().includes(q)
                  );
                });

                if (eventRegs.length === 0) {
                  return (
                    <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                      <Users size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                      <h4 style={{ color: '#334155', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                        No Registered Students Yet
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
                        Students who register for <strong>{rosterModalEvent.title}</strong> will automatically appear here with their SRMIST email and register number verified.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '45px' }}>#</th>
                          <th>Reg ID</th>
                          <th>Student Name</th>
                          <th>Register Number</th>
                          <th>SRMIST Email</th>
                          <th>Department & Year</th>
                          <th>Phone / WhatsApp</th>
                          <th>Registered At</th>
                          <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedRegs.map((reg, index) => (
                          <tr key={reg.id}>
                            <td style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                            <td>
                              <span className="badge-reg-id">{reg.id}</span>
                            </td>
                            <td style={{ fontWeight: 600, color: '#1e293b' }}>
                              {reg.name || reg.fullName}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                              {reg.registerNumber || reg.regNumber}
                            </td>
                            <td>
                              <span className="badge-srm-email">
                                <Check size={12} /> {reg.email}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>{reg.department || 'N/A'}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{reg.year ? `Year ${reg.year}` : ''}</div>
                            </td>
                            <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                              {reg.phone || 'N/A'}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                              {reg.registeredAt || 'N/A'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn-icon-action delete"
                                onClick={() => {
                                  if (window.confirm(`Delete registration for "${reg.name || reg.fullName}" (${reg.id})?`)) {
                                    deleteRegistration(reg.id);
                                    showToast(`Registration ${reg.id} deleted.`);
                                  }
                                }}
                                title="Delete Registration"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn admin-btn-outline-light" 
                style={{ color: '#475569', borderColor: '#cbd5e1' }} 
                onClick={() => setRosterModalEvent(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="srm-btn-excel"
                onClick={() => {
                  exportRegistrationsExcel(rosterModalEvent.id);
                  showToast(`Excel downloaded for ${rosterModalEvent.title}`);
                }}
                disabled={registrations.filter(r => r.eventId === rosterModalEvent.id).length === 0}
              >
                <FileSpreadsheet size={16} /> Download Excel (.xlsx)
              </button>
            </div>
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
