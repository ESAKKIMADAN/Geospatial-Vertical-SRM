import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, AlertCircle, Sparkles, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import '../styles/EventRegisterModal.css';

const EventRegisterModal = ({ event, isOpen, onClose }) => {
  const { addRegistration } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registerNumber: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: ''
  });

  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setSuccessResult(null);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim().toLowerCase();

    // SRMIST institutional email check
    if (!cleanEmail.endsWith('@srmist.edu.in')) {
      setError('Registration Restricted: Please enter an active @srmist.edu.in institutional email address (e.g. ra1234@srmist.edu.in).');
      return;
    }

    if (!formData.name.trim() || !formData.registerNumber.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory fields.');
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
      setError(null);
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
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="event-reg-modal-overlay" onClick={onClose}>
      <div className="event-reg-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="event-reg-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {successResult ? (
          <div className="event-reg-success">
            <div className="reg-success-icon">
              <CheckCircle size={48} />
            </div>
            <h2 className="reg-success-title">Registration Confirmed!</h2>
            <p className="reg-success-desc">
              Your registration for <strong>"{event.title}"</strong> has been confirmed and logged in the official live event attendee roster.
            </p>
            <div>
              <span className="reg-id-badge">ID: {successResult.id}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '2rem' }}>
              Confirmation details logged for <strong>{successResult.name}</strong> ({successResult.email}).
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Done & Return to Events
            </button>
          </div>
        ) : (
          <>
            <div className="event-reg-header-banner">
              <div className="reg-badge-chip">
                <Sparkles size={14} /> Official Event Registration
              </div>
              <h2 className="event-reg-title">{event.title}</h2>
              <div className="event-reg-meta-row">
                {event.date && (
                  <span className="event-reg-meta-item">
                    <Calendar size={15} color="#20c997" /> {event.date}
                  </span>
                )}
                {event.time && (
                  <span className="event-reg-meta-item">
                    <Clock size={15} color="#20c997" /> {event.time}
                  </span>
                )}
                {event.venue && (
                  <span className="event-reg-meta-item">
                    <MapPin size={15} color="#20c997" /> {event.venue}
                  </span>
                )}
              </div>
            </div>

            <div className="event-reg-body">
              {error && (
                <div className="event-reg-error-box">
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="event-reg-form">
                <div className="form-group">
                  <label>Student Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setError(null); }}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>SRMIST Email ID *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required
                      placeholder="as1234@srmist.edu.in"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(null); }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Register Number / Student ID *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      placeholder="e.g. RA2311003010145"
                      value={formData.registerNumber}
                      onChange={(e) => { setFormData({ ...formData, registerNumber: e.target.value }); setError(null); }}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Department / Branch</label>
                    <select 
                      className="form-control"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computational Intelligence">Computational Intelligence (CINTEL)</option>
                      <option value="Civil Engineering & GIS">Civil Engineering & GIS</option>
                      <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                      <option value="Aerospace / Remote Sensing">Aerospace & Remote Sensing</option>
                      <option value="Other Department">Other Department</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Year of Study</label>
                    <select 
                      className="form-control"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Post Graduate / M.Tech">Post Graduate / M.Tech</option>
                      <option value="PhD / Research Scholar">PhD / Research Scholar</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>WhatsApp / Phone Number *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setError(null); }}
                  />
                </div>

                <div className="event-reg-actions">
                  <button type="button" className="btn btn-outline" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={16} /> Confirm Registration
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventRegisterModal;
