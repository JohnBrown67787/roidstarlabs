import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';

export default function ContactUsPage({ onNavigateToShop, onShowToast }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onShowToast?.('Thank you! Your inquiry has been sent to info@roidstacklab.com.');
    }, 800);
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. HERO BANNER */}
      <div 
        className="page-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://roidstarlabs.com/wp-content/uploads/2024/01/Qatar-scales-new-heights-in-healthcare-sector-in-2022.jpg')`
        }}
      >
        <div className="container page-hero-content">
          <h1 className="page-hero-title">CONTACT US</h1>
          <p className="page-hero-breadcrumbs">
            <span>Home</span> / <span className="active">Contact Us</span>
          </p>
        </div>
      </div>

      {/* 2. GET IN TOUCH INTRO */}
      <section className="container contact-main-section">
        <div className="contact-intro-header">
          <h2 className="contact-main-heading">GET IN TOUCH</h2>
          <div className="gold-divider" style={{ margin: '14px auto 20px' }}></div>
          <p className="contact-intro-text">
            Health is the foundation of a happy and fulfilling life. Staying physically and mentally fit requires not only discipline and awareness but also the right guidance. Our contact us section is designed to make it easy for you to reach our dedicated support team whenever you need help, advice, or product-related assistance. Whether you have questions about your order, our services, or health guidance, we’re here to support you at every step. You can also explore more about our trusted health and wellness{' '}
            <a 
              href="#shop" 
              onClick={(e) => { e.preventDefault(); onNavigateToShop(); }}
              style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
            >
              products
            </a>{' '}
            directly.
          </p>
        </div>

        {/* 3. MEDICAL TEAM HERO IMAGE */}
        <div className="contact-team-showcase">
          <div className="team-img-wrap">
            <img 
              src="https://roidstarlabs.com/wp-content/uploads/2024/01/successful-medical-team-84464744-1067x800.webp" 
              alt="Successful medical team at Roid Starlabs" 
              className="medical-team-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* 4. FORM & SUPPORT GRID */}
        <div className="contact-grid-container">
          {/* WPForms Replica */}
          <div className="contact-form-box">
            <h3 className="contact-form-title">Send Us a Direct Message</h3>
            <div className="widget-divider" style={{ marginBottom: '24px' }}></div>

            {submitted ? (
              <div className="contact-success-notice">
                <CheckCircle2 size={48} color="#229409" style={{ margin: '0 auto 14px' }} />
                <h3>Message Received!</h3>
                <p>
                  Thank you for contacting Roid Starlabs. A licensed customer care specialist will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  className="add-cart-mini-btn" 
                  style={{ marginTop: '18px', padding: '10px 24px' }}
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="wpforms-replica-form">
                {/* Name */}
                <div className="form-group">
                  <label className="wpforms-field-label">
                    Name <span className="wpforms-required">*</span>
                  </label>
                  <div className="form-row-2">
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder="First"
                        className="wpforms-input"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <span className="wpforms-sublabel">First</span>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        required 
                        placeholder="Last"
                        className="wpforms-input"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      <span className="wpforms-sublabel">Last</span>
                    </div>
                  </div>
                </div>

                {/* Numbers */}
                <div className="form-group">
                  <label className="wpforms-field-label">Numbers (Phone)</label>
                  <input 
                    type="tel" 
                    placeholder="Enter phone number"
                    className="wpforms-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="wpforms-field-label">
                    Email <span className="wpforms-required">*</span>
                  </label>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    className="wpforms-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="wpforms-field-label">Message</label>
                  <textarea 
                    rows={5} 
                    required 
                    placeholder="How can our clinical team help you today?"
                    className="wpforms-input"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button 
                  type="submit" 
                  className="wpforms-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Customer Support Info Cards */}
          <div className="contact-info-panel">
            <div className="contact-info-card">
              <h3 className="contact-card-heading">Contact Information</h3>
              <div className="widget-divider" style={{ marginBottom: '20px' }}></div>

              <div className="contact-detail-items">
                <div className="contact-detail-item">
                  <div className="detail-icon-circle">
                    <Mail size={18} color="#229409" />
                  </div>
                  <div>
                    <strong>Email Support:</strong>
                    <p><a href="mailto:info@roidstacklab.com">info@roidstacklab.com</a></p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-circle">
                    <Phone size={18} color="#229409" />
                  </div>
                  <div>
                    <strong>Direct Helpline:</strong>
                    <p><a href="tel:+19176650015">+1 (917) 665-0015</a></p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-circle" style={{ background: '#1877F2', color: '#fff' }}>
                    <FacebookIcon size={18} color="#fff" />
                  </div>
                  <div>
                    <strong>Facebook:</strong>
                    <p>
                      <a 
                        href="https://www.facebook.com/share/19h9qgRnYw/?mibextid=wwXIfr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ wordBreak: 'break-all' }}
                      >
                        facebook.com/share/19h9qgRnYw
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-circle" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff' }}>
                    <InstagramIcon size={18} color="#fff" />
                  </div>
                  <div>
                    <strong>Instagram:</strong>
                    <p>
                      <a 
                        href="https://www.instagram.com/roidstack?stkn=MTV3czU5MzRvZnoycQ%3D%3D&utm_source=qr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        @roidstack
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-circle">
                    <MapPin size={18} color="#229409" />
                  </div>
                  <div>
                    <strong>Headquarters:</strong>
                    <p>907 Blue Heron Blvd, Osteen, FL 32764, USA</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon-circle">
                    <Clock size={18} color="#229409" />
                  </div>
                  <div>
                    <strong>Working Hours:</strong>
                    <p>Monday – Saturday: 8:00 AM – 8:00 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="contact-whatsapp-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <MessageCircle size={22} color="#25D366" />
                  <strong style={{ color: '#111' }}>Instant Chat Available</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '14px', lineHeight: '1.5' }}>
                  Speak directly with a support agent on WhatsApp for cycle guidance and payment confirmation.
                </p>
                <a 
                  href="https://wa.me/19176650015" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="whatsapp-inline-btn"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
