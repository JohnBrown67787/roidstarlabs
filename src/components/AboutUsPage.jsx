import React from 'react';
import { ShieldCheck, Heart, Award, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function AboutUsPage({ onNavigateToShop }) {
  return (
    <div className="about-page-wrapper">
      {/* 1. HERO BANNER */}
      <div 
        className="page-hero-banner"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://roidstarlabs.com/wp-content/uploads/2024/01/shutterstock_2276641447.jpg')`
        }}
      >
        <div className="container page-hero-content">
          <h1 className="page-hero-title">ABOUT US</h1>
          <p className="page-hero-breadcrumbs">
            <span>Home</span> / <span className="active">About Us</span>
          </p>
        </div>
      </div>

      {/* 2. MAIN INTRODUCTION */}
      <section className="about-intro-section">
        <div className="container">
          <div className="about-intro-header">
            <h2 className="about-clinic-title">About Us | Roid Starlabs Clinic</h2>
            <div className="gold-divider" style={{ margin: '14px auto 20px' }}></div>
            <p className="about-intro-lead">
              Welcome to our world of health, balance, and transformation. This about us page is more than just an introduction — it’s a story of dedication, growth, and genuine care for your well-being. Through our platform, we’ve helped countless individuals achieve their personal fitness and health goals with safe, effective, and scientifically tested solutions. We believe that true wellness is not only about physical strength but also about confidence, balance, and a mindset focused on long-term success.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div className="pillar-icon-box">
                <Award size={26} color="#229409" />
              </div>
              <h3 className="pillar-title">Share Success Stories</h3>
              <p className="pillar-text">
                Highlight stories of clients or customers who have achieved their health goals through your products or services. Share their before-and-after pictures, testimonials, and inspirational quotes to motivate others.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="pillar-icon-box">
                <Sparkles size={26} color="#066aab" />
              </div>
              <h3 className="pillar-title">Offer Behind-the-Scenes Glimpses</h3>
              <p className="pillar-text">
                Show followers what happens behind the scenes of our operations, from product sourcing and batch verification to laboratory assay certifications. We share the rigorous science behind how we make our products and what inspires us.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="pillar-icon-box">
                <Heart size={26} color="#e63946" />
              </div>
              <h3 className="pillar-title">Tips for Work-Life Balance</h3>
              <p className="pillar-text">
                Share stories of how you balance work responsibilities with self-care, family, and training. We offer guidance on avoiding burnout, prioritizing mental and physical wellness, and sustaining high performance over the long term.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLUE STORY SECTION (#0b346a) */}
      <section className="about-blue-section">
        <div className="container">
          <div className="about-blue-grid">
            <div className="about-blue-text-col">
              <h2 className="about-blue-heading">Holistic Wellness &amp; Nutrition Routine</h2>
              <div className="gold-divider" style={{ margin: '14px 0 20px', backgroundColor: '#ffd700' }}></div>
              <p className="about-blue-p">
                Share a nourishing and hydrating face mask recipe made with avocado and yogurt, for example. Explain the skin benefits of avocado, such as its healthy fats and vitamins, and how yogurt’s lactic acid helps to exfoliate and brighten the skin gently. Include step-by-step instructions and encourage your followers to share their experiences with you.
              </p>
              <p className="about-blue-p">
                Share easy and healthy meal prep recipes that your followers can make ahead of time to simplify their weekly meal planning. Include breakfast, lunch, and dinner recipes, focusing on balanced nutrition and portion control About Us.
              </p>

              <div className="about-highlights-list">
                <div className="highlight-item">
                  <CheckCircle size={18} color="#22c55e" />
                  <span>Licensed Clinical Formulations &amp; Testing</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={18} color="#22c55e" />
                  <span>90+ Years Combined Clinical Expertise</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={18} color="#22c55e" />
                  <span>100% US Domestic Express Logistics</span>
                </div>
              </div>

              <button 
                className="about-explore-btn"
                onClick={onNavigateToShop}
              >
                <span>Explore Products</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="about-blue-img-col">
              <div className="about-blue-image-frame">
                <img 
                  src="https://roidstarlabs.com/wp-content/uploads/2024/01/Who-We-Are-Main-1024x683-1.jpg" 
                  alt="Who We Are - Roid Starlabs" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
