import React, { useState } from 'react';
import { Star, Quote, Send, CheckCircle2 } from 'lucide-react';

const REAL_TESTIMONIALS = [
  {
    id: 1,
    name: "John Homer",
    avatar: "https://roidstarlabs.com/wp-content/uploads/2024/01/360_F_215634201_6MHT39zdmOmAmbbWLth2z7KMvpiZnMak-280x280.jpg",
    rating: 5,
    tag: "Verified Buyer",
    review: "The anti-aging products from The Roidstarlabs completely transformed my skin and energy levels. I used to look and feel older, but now people think I’m 35 when I’m actually 51. Products are top-notch, and delivery was right on time. If you're thinking about it—go for it!"
  },
  {
    id: 2,
    name: "Scott Cohen",
    avatar: "https://roidstarlabs.com/wp-content/uploads/2024/01/business-woman-isolated-illustration-ai-generative-png-280x280.webp",
    rating: 5,
    tag: "Verified Client",
    review: "I struggled with weight loss for years. The fat burners and SARMs combo from The Roid Starlabs helped me lose 12 kg in just 3 months—without losing muscle. Super effective and delivered right when promised. Don’t wait—buy now and see the results yourself!"
  },
  {
    id: 3,
    name: "James",
    avatar: "https://roidstarlabs.com/wp-content/uploads/2024/01/istockphoto-1171169099-612x612-1-280x280.jpg",
    rating: 5,
    tag: "Fitness Athlete",
    review: "As a serious bodybuilder, quality and trust are everything. The injectable steroids from The Roid Starlabs gave me noticeable gains and faster recovery without any side effects. Products arrived on time and safely packed. Highly recommend for anyone training hard!”"
  }
];

export default function TestimonialPage({ onNavigateToShop, onShowToast }) {
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [submittedReview, setSubmittedReview] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setSubmittedReview(true);
    onShowToast?.('Thank you! Your testimonial has been submitted for review.');
  };

  return (
    <div className="testimonial-page-wrapper">
      {/* 1. HERO BANNER */}
      <div 
        className="page-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://roidstarlabs.com/wp-content/uploads/2024/01/istockphoto-1689003176-170667a.webp')`
        }}
      >
        <div className="container page-hero-content">
          <h1 className="page-hero-title">TESTIMONIAL</h1>
          <p className="page-hero-breadcrumbs">
            <span>Home</span> / <span className="active">Testimonial</span>
          </p>
        </div>
      </div>

      {/* 2. INTRO HEADER */}
      <section className="container testimonial-intro-section">
        <h2 className="testimonial-main-heading">
          Testimonial – Real Stories of Transformation and Trust
        </h2>
        <div className="gold-divider" style={{ margin: '14px auto 20px' }}></div>
        <p className="testimonial-intro-text">
          Every satisfied customer has a story to tell, and each one inspires us to keep improving our quality and service. This testimonial page highlights the real experiences of people who have trusted our products and witnessed visible, lasting results. From fitness enthusiasts to everyday individuals pursuing better health, their feedback reflects our dedication to excellence and care. You can explore our complete range of trusted wellness and performance products on{' '}
          <a 
            href="#shop" 
            onClick={(e) => { e.preventDefault(); onNavigateToShop(); }}
            style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
          >
            roidstarlabs.com
          </a>
        </p>

        {/* 3 TESTIMONIAL CARDS */}
        <div className="testimonials-cards-grid">
          {REAL_TESTIMONIALS.map(item => (
            <div key={item.id} className="testimonial-speech-card">
              <div className="testimonial-avatar-wrapper">
                <img src={item.avatar} alt={item.name} className="testimonial-avatar-img" />
              </div>

              <div className="testimonial-rating-row">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#f1a90d" color="#f1a90d" />
                ))}
              </div>

              <h4 className="testimonial-client-name">{item.name}</h4>
              <span className="testimonial-client-tag">{item.tag}</span>

              <p className="testimonial-quote-text">
                "{item.review}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUBMIT A TESTIMONIAL BOX */}
      <section className="testimonial-form-section">
        <div className="container">
          <div className="testimonial-form-card">
            <h3 className="form-card-title">Share Your Experience With Us</h3>
            <p className="form-card-subtitle">
              Your journey inspires others. Let the community know how Roid Starlabs helped you reach your wellness milestones.
            </p>

            {submittedReview ? (
              <div className="review-success-box">
                <CheckCircle2 size={42} color="#229409" style={{ margin: '0 auto 12px' }} />
                <h4>Thank You For Sharing!</h4>
                <p>Your feedback is greatly appreciated by our medical and coaching staff.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-input-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control-input"
                      placeholder="e.g. Michael T."
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <select 
                      className="form-control-input"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 / 5) - Outstanding</option>
                      <option value={4}>⭐⭐⭐⭐ (4 / 5) - Great</option>
                      <option value={3}>⭐⭐⭐ (3 / 5) - Good</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review / Experience *</label>
                  <textarea 
                    rows={4} 
                    required 
                    className="form-control-input"
                    placeholder="Tell us about the products, cycle results, shipping speed, and support..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <button type="submit" className="testimonial-submit-btn">
                  <Send size={16} />
                  <span>Submit Testimonial</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
