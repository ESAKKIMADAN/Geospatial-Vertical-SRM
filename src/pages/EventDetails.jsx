import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Share2, Check, AlertCircle, 
  Send, Sparkles, ShieldCheck, ArrowLeft, ExternalLink, 
  CheckCircle, Download, BookOpen, Award, Users, Laptop
} from 'lucide-react';
import { useData } from '../context/DataContext';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { upcomingEvents, pastEvents, addRegistration } = useData();

  // Find matching event across upcoming and past
  const allEvents = [
    ...upcomingEvents.map(e => ({ ...e, isUpcoming: true })),
    ...pastEvents.map(e => ({ ...e, isUpcoming: false }))
  ];
  
  const event = allEvents.find(e => e.id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registerNumber: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: ''
  });

  const [formError, setFormError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3500);
      }).catch(() => {
        prompt('Copy this event link for students:', currentUrl);
      });
    } else {
      prompt('Copy this event link for students:', currentUrl);
    }
  };

  const handleScrollToForm = () => {
    const formElement = document.getElementById('registration-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();

    // SRMIST institutional email check
    if (!cleanEmail.endsWith('@srmist.edu.in')) {
      setFormError('Please enter an official @srmist.edu.in student email address (e.g. ab1234@srmist.edu.in).');
      return;
    }

    if (!formData.name.trim() || !formData.registerNumber.trim() || !formData.phone.trim()) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    const res = addRegistration({
      eventId: event.id,
      eventTitle: event.title,
      name: formData.name,
      email: cleanEmail,
      registerNumber: formData.registerNumber,
      department: formData.department,
      year: formData.year,
      phone: formData.phone
    });

    if (res.success) {
      setFormError(null);
      setSuccessResult(res.registration);
      setFormData({
        name: '',
        email: '',
        registerNumber: '',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        phone: ''
      });
    } else {
      setFormError(res.error || 'Registration failed. Please try again.');
    }
  };

  if (!event) {
    return (
      <div className="event-details-page" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <AlertCircle size={52} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#002b66', marginBottom: '0.75rem' }}>Event Not Found</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            The event you are looking for may have been updated, rescheduled, or removed.
          </p>
          <Link to="/events" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const isExternal = event.registrationType === 'link' && event.registrationLink;
  const isUpcoming = event.isUpcoming;

  return (
    <div className="event-details-page">
      {/* ================= HERO HEADER ================= */}
      <section className="event-hero">
        <div className="event-hero-container">
          <nav className="event-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="event-breadcrumb-sep">/</span>
            <Link to="/events">Events</Link>
            <span className="event-breadcrumb-sep">/</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{event.title}</span>
          </nav>

          <div className="event-hero-badges">
            <span className={isUpcoming ? "badge-tag-upcoming" : "badge-tag-past"}>
              <Sparkles size={13} /> {isUpcoming ? "Upcoming Event" : "Completed Event"}
            </span>
            <span className="badge-tag-vertical">
              Geospatial Computing Research Vertical • SRMIST
            </span>
          </div>

          <h1 className="event-hero-title">{event.title}</h1>

          <div className="event-hero-meta-grid">
            {event.date && (
              <div className="event-hero-meta-item">
                <Calendar size={18} />
                <span><strong>Date:</strong> {event.date}</span>
              </div>
            )}
            {event.time && (
              <div className="event-hero-meta-item">
                <Clock size={18} />
                <span><strong>Time:</strong> {event.time}</span>
              </div>
            )}
            {event.venue && (
              <div className="event-hero-meta-item">
                <MapPin size={18} />
                <span><strong>Venue:</strong> {event.venue}</span>
              </div>
            )}
            <div className="event-hero-meta-item">
              <Users size={18} />
              <span><strong>Audience:</strong> SRMIST Students (All Branches)</span>
            </div>
          </div>

          <div className="event-hero-actions">
            {isUpcoming && !isExternal && (
              <button 
                type="button" 
                className="btn-hero-register"
                onClick={handleScrollToForm}
              >
                <Send size={18} /> Register for Event
              </button>
            )}

            {isUpcoming && isExternal && (
              <a 
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-register"
              >
                <ExternalLink size={18} /> Register on External Portal
              </a>
            )}

            <button 
              type="button" 
              className="btn-hero-share"
              onClick={handleShare}
              title="Copy link to share directly with students"
            >
              <Share2 size={16} /> Share Event Link
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="event-main-content">
        {/* Left Column: Banner & Detailed Event Information */}
        <div className="event-details-column">
          {/* Banner Card */}
          <div className="event-banner-card">
            <img 
              src={event.image || "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              alt={event.title} 
              className="event-banner-img" 
            />
          </div>

          {/* About Event */}
          <div className="event-info-card">
            <h2 className="event-section-heading">
              <BookOpen size={20} /> About This Workshop / Session
            </h2>
            <p className="event-desc-text">
              {event.description}
            </p>

            {/* Highlights Grid */}
            <h3 className="event-section-heading" style={{ fontSize: '1.15rem', marginTop: '1.5rem' }}>
              <Award size={18} /> What You Will Experience
            </h3>
            <div className="event-highlights-grid">
              <div className="event-highlight-item">
                <div className="highlight-icon-wrap">
                  <Laptop size={18} />
                </div>
                <div className="highlight-text">
                  <h4>Hands-on Geospatial Workflows</h4>
                  <p>Practical demonstrations using industry mapping platforms and spatial tools.</p>
                </div>
              </div>

              <div className="event-highlight-item">
                <div className="highlight-icon-wrap">
                  <Award size={18} />
                </div>
                <div className="highlight-text">
                  <h4>Certificate of Participation</h4>
                  <p>Official verified e-certificate issued by SRMIST Computing Technologies.</p>
                </div>
              </div>

              <div className="event-highlight-item">
                <div className="highlight-icon-wrap">
                  <Users size={18} />
                </div>
                <div className="highlight-text">
                  <h4>Faculty & Peer Mentorship</h4>
                  <p>Direct interaction with domain specialists and vertical research team.</p>
                </div>
              </div>

              <div className="event-highlight-item">
                <div className="highlight-icon-wrap">
                  <Sparkles size={18} />
                </div>
                <div className="highlight-text">
                  <h4>Real-world Spatial Datasets</h4>
                  <p>Analyze live satellite, remote sensing, and urban telemetry data.</p>
                </div>
              </div>
            </div>

            {/* Organizing Info */}
            <div className="event-organizer-box">
              <div className="organizer-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="organizer-info">
                <h4>Organized by Geospatial Computing Research Vertical</h4>
                <p>Department of Computing Technologies • SRMIST, Kattankulathur, Chennai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Student Registration Section */}
        <div className="event-reg-column" id="registration-section">
          <div className="event-reg-card">
            <div className="event-reg-card-header">
              <div className="event-reg-badge-chip">
                <Sparkles size={13} /> Official SRMIST Registration
              </div>
              <h3 className="event-reg-card-title">
                {isUpcoming ? 'Reserve Your Seat' : 'Event Registration'}
              </h3>
              <p className="event-reg-card-subtitle">
                {isUpcoming 
                  ? 'Open to all SRMIST students. Free entry with SRM email.'
                  : 'This event has concluded.'}
              </p>
            </div>

            <div className="event-reg-card-body">
              {successResult ? (
                /* Registration Confirmed Pass */
                <div className="reg-success-ticket">
                  <div className="reg-success-icon-wrap">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="reg-success-heading">Registration Confirmed!</h3>
                  <p className="reg-success-subtitle">
                    Your seat has been reserved and your registration is recorded in the official vertical roster.
                  </p>

                  <div className="reg-slip-box">
                    <div className="reg-slip-id-tag">
                      ID: {successResult.id}
                    </div>
                    <div className="reg-slip-row">
                      <span className="label">Student Name:</span>
                      <span className="value">{successResult.name}</span>
                    </div>
                    <div className="reg-slip-row">
                      <span className="label">Register Number:</span>
                      <span className="value">{successResult.registerNumber}</span>
                    </div>
                    <div className="reg-slip-row">
                      <span className="label">SRMIST Email:</span>
                      <span className="value">{successResult.email}</span>
                    </div>
                    <div className="reg-slip-row">
                      <span className="label">Department:</span>
                      <span className="value">{successResult.department}</span>
                    </div>
                    <div className="reg-slip-row">
                      <span className="label">Event:</span>
                      <span className="value">{event.title}</span>
                    </div>
                    <div className="reg-slip-row" style={{ borderBottom: 'none' }}>
                      <span className="label">Date & Venue:</span>
                      <span className="value">{event.date} • {event.venue}</span>
                    </div>
                  </div>

                  <div className="reg-success-actions">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => window.print()}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
                    >
                      <Download size={16} /> Print / Save Pass
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setSuccessResult(null)}
                      style={{ fontSize: '0.88rem' }}
                    >
                      Register Another Student
                    </button>
                    <Link 
                      to="/events" 
                      className="btn btn-outline" 
                      style={{ textDecoration: 'none', textAlign: 'center', fontSize: '0.88rem' }}
                    >
                      ← Back to All Events
                    </Link>
                  </div>
                </div>
              ) : isUpcoming ? (
                isExternal ? (
                  /* External Link Portal */
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                      Registration for <strong>{event.title}</strong> is being handled through an external portal. Click the button below to register directly:
                    </p>
                    <a 
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-submit-registration"
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink size={18} /> Open Registration Portal
                    </a>
                  </div>
                ) : (
                  /* Full Registration Form */
                  <form onSubmit={handleSubmit} className="event-reg-form">
                    {formError && (
                      <div className="reg-error-alert">
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="reg-field-group">
                      <label htmlFor="reg-name">
                        Student Full Name <span className="required">*</span>
                      </label>
                      <input 
                        id="reg-name"
                        type="text" 
                        placeholder="e.g. Aditi Sharma" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-email">
                        SRMIST Institutional Email <span className="required">*</span>
                      </label>
                      <input 
                        id="reg-email"
                        type="email" 
                        placeholder="e.g. as1234@srmist.edu.in" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <span className="reg-field-hint">Must end with @srmist.edu.in</span>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-regno">
                        Register Number / Student ID <span className="required">*</span>
                      </label>
                      <input 
                        id="reg-regno"
                        type="text" 
                        placeholder="e.g. RA2311003010145" 
                        value={formData.registerNumber}
                        onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-dept">Department / Branch</label>
                      <select 
                        id="reg-dept"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Data Science & GenAI">Data Science & GenAI</option>
                        <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Computational Intelligence">Computational Intelligence</option>
                        <option value="Civil Engineering & GIS">Civil Engineering & GIS</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Other Department">Other Department</option>
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-year">Year of Study</label>
                      <select 
                        id="reg-year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Post Graduate / Research">Post Graduate / Research</option>
                      </select>
                    </div>

                    <div className="reg-field-group">
                      <label htmlFor="reg-phone">
                        Phone / WhatsApp Number <span className="required">*</span>
                      </label>
                      <input 
                        id="reg-phone"
                        type="tel" 
                        placeholder="e.g. +91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-submit-registration">
                      <Send size={18} /> Confirm & Submit Registration
                    </button>

                    <div className="reg-security-badge">
                      <ShieldCheck size={14} color="#10b981" />
                      <span>Direct real-time sync with SRMIST event roster</span>
                    </div>
                  </form>
                )
              ) : (
                /* Completed Event */
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <Calendar size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ color: '#334155', marginBottom: '0.5rem' }}>Registration Closed</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    This event has concluded. Stay tuned for future workshops and hackathons organized by the Geospatial Vertical!
                  </p>
                  <Link to="/events" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                    Browse Upcoming Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="share-toast">
          <Check size={18} color="#38bdf8" />
          <span>Link copied! Share directly with students via WhatsApp / Teams.</span>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
