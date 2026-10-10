import React, { useState, useEffect } from 'react';
import { X, Mail, Send, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const { addMessage } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
      setSubmitted(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Strict validation: ONLY @srmist.edu.in allowed
    if (!cleanEmail.endsWith('@srmist.edu.in')) {
      setError('Access Restricted: Only @srmist.edu.in institutional email addresses are allowed (e.g. yourname@srmist.edu.in).');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide your comments or inquiry before sending.');
      return;
    }

    const res = addMessage({
      name: name.trim() || 'SRMIST Student',
      email: cleanEmail,
      comment: comment.trim()
    });

    if (res.success) {
      setError(null);
      setSubmitted(true);
      setName('');
      setEmail('');
      setComment('');
    } else {
      setError(res.error || 'Failed to submit message.');
    }
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="contact-success-view">
            <div className="success-icon-badge">
              <CheckCircle size={48} />
            </div>
            <h3 className="success-title">Message Delivered to Admin!</h3>
            <p className="success-desc">
              Thank you for contacting the Geospatial Computing Research Vertical. Your inquiry and comments have been dispatched directly to the admin dashboard.
            </p>
            <div className="success-email-pill">
              Confirmation sent to verified SRMIST email
            </div>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>
              Done & Return
            </button>
          </div>
        ) : (
          <>
            <div className="contact-modal-header">
              <div className="contact-header-badge">
                <MessageSquare size={16} /> Contact Desk
              </div>
              <h2 className="contact-modal-title">Send Inquiry & Comments</h2>
              <p className="contact-modal-subtitle">
                Have questions regarding research initiatives, projects, or workshops? Submit your comments directly to the vertical coordinators.
              </p>
            </div>

            {error && (
              <div className="contact-error-banner">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null); }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SRMIST Institutional Email *</span>
                  <span style={{ fontSize: '0.78rem', color: '#20c997', fontWeight: 600 }}>@srmist.edu.in required</span>
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  required
                  placeholder="e.g. ra1234@srmist.edu.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                />
              </div>

              <div className="form-group">
                <label>Comments / Message *</label>
                <textarea 
                  className="form-control" 
                  rows={4}
                  required
                  placeholder="Type your questions, project suggestions, or comments here..."
                  value={comment}
                  onChange={(e) => { setComment(e.target.value); setError(null); }}
                />
              </div>

              <div className="contact-modal-actions">
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={16} /> Send Message
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
