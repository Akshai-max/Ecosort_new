'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Bot, Leaf, BarChart3, Mail, Phone, Building2 } from 'lucide-react';
import styles from './landing.module.css';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    wasteVolume: '',
    message: ''
  });

  // Calculate progress based on filled fields
  const getProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field.trim() !== '').length;
    return (filledFields / fields.length) * 100;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <nav className={styles.header}>
          <div className={styles.headerLeft}>
            <Image src="/ecosort-logo.png" alt="Ecosort" width={48} height={48} priority className={styles.logo} />
            <span className={styles.brandName}>Ecosort</span>
          </div>
          <div className={styles.headerRight}>
            <a href="#home" className={styles.navLink}>Home</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#contact" className={styles.navLink}>Contact</a>
            <div className={styles.authButtons}>
              <a
                href="/user-employee/login"
                className={styles.loginButton}
              >
                Login
              </a>
              <a
                href="/register/user"
                className={styles.signupButton}
              >
                Sign up
              </a>
            </div>
          </div>
        </nav>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* White Background with Overlapping Green Waves */}
        <div className={styles.backgroundSvg}>
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lightGreenWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="30%" stopColor="#bbf7d0" />
                <stop offset="60%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <linearGradient id="darkGreenWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="30%" stopColor="#bbf7d0" />
                <stop offset="60%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <linearGradient id="verticalWave" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" />
                <stop offset="30%" stopColor="#bbf7d0" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
            </defs>
            
            {/* White background */}
            <rect width="1200" height="800" fill="#ffffff" />
            
            {/* Darker green wave - behind the light wave */}
            <path 
              d="M0,300 Q200,200 400,350 Q600,500 800,400 Q1000,300 1200,450 L1200,800 L0,800 Z" 
              fill="url(#darkGreenWave)" 
              opacity="0.8"
            />
            
            {/* Lighter green wave - overlapping the dark wave */}
            <path 
              d="M0,400 Q200,300 400,450 Q600,600 800,500 Q1000,400 1200,550 L1200,800 L0,800 Z" 
              fill="url(#lightGreenWave)" 
              opacity="0.9"
            />
            
            {/* Vertical wave from top right */}
            <path 
              d="M800,0 Q900,100 850,200 Q900,300 800,400 Q900,500 850,600 Q900,700 800,800 L1200,800 L1200,0 Z" 
              fill="url(#verticalWave)" 
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className={styles.contentContainer}>
          {/* Left Section - Content */}
          <div className={styles.leftSection}>
            <div className={styles.contentWrapper}>
              {/* Purpose Tag */}
              <div className={styles.purposeTag}>
                01 Purpose
              </div>
              
              {/* Main Headline */}
              <h1 className={styles.mainHeadline}>
                Ecosort: Where AI Meets<br />
                Waste Management
              </h1>
              
              {/* Description */}
              <p className={styles.description}>
                The smart waste classification system that learns and adapts to help you make better environmental choices every day.
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => router.push('/login')}
                className={styles.ctaButton}
              >
                Get Started →
              </button>
            </div>
          </div>

          {/* Right Section - Card */}
          <div className={styles.rightSection}>
            {/* Dark Card */}
            <div className={styles.robotCard}>
              <div className={styles.robotContent}>
                {/* Simple Robot Design */}
                <div className={styles.robotDesign}>
                  {/* Robot Head - Green Circle with Black Eye */}
                  <div className={styles.robotHead}>
                    <div className={styles.robotEye}>
                      <div className={styles.eyePupil}></div>
                    </div>
                  </div>
                  
                  {/* Robot Body - White Rectangle */}
                  <div className={styles.robotBody}></div>
                  
                  {/* Robot Legs - Black with Green Tops */}
                  <div className={styles.robotLegs}>
                    <div className={styles.robotLeg}>
                      <div className={styles.legTop}></div>
                    </div>
                    <div className={styles.robotLeg}>
                      <div className={styles.legTop}></div>
                    </div>
                  </div>
                </div>
                
                {/* Text */}
                <h3 className={styles.robotTitle}>Smart Sorting</h3>
                <p className={styles.robotSubtitle}>AI-Powered Waste Classification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* About Section - Beautiful and Pleasant Design */}
        <div id="about" className={styles.aboutSection}>
          <div className={styles.aboutContainer}>
            <div className={styles.aboutWrapper}>
              {/* Section Header */}
              <div className={styles.aboutHeader}>
                <div className={styles.aboutTag}>
                  About Ecosort
                </div>
                <h2 className={styles.aboutTitle}>
                  Revolutionizing Waste Management
                  <br />
                  <span className={styles.aboutTitleAccent}>One Smart Sort at a Time</span>
                </h2>
                <p className={styles.aboutDescription}>
                  We're on a mission to make waste classification intelligent, efficient, and accessible for everyone.
                </p>
              </div>

              {/* Features Grid */}
              <div className={styles.featuresGrid}>
                {/* Feature 1 */}
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Bot className="text-green-600" size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className={styles.featureTitle}>AI-Powered Intelligence</h3>
                  <p className={styles.featureDescription}>
                    Our advanced machine learning algorithms can identify and classify waste with 95% accuracy, learning from every interaction.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Leaf className="text-green-600" size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className={styles.featureTitle}>Environmental Impact</h3>
                  <p className={styles.featureDescription}>
                    Help reduce landfill waste and increase recycling rates by making smart sorting decisions every day.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <BarChart3 className="text-green-600" size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className={styles.featureTitle}>Smart Analytics</h3>
                  <p className={styles.featureDescription}>
                    Track your environmental impact with detailed insights and personalized recommendations for better waste management.
                  </p>
                </div>
              </div>

              {/* Mission Statement */}
              <div className={styles.missionCard}>
                <div className={styles.missionContent}>
                  <h3 className={styles.missionTitle}>Our Mission</h3>
                  <p className={styles.missionText}>
                    At Ecosort, we believe that technology should work <span className={styles.missionAccent}>with</span> you, not <span className={styles.missionAccent}>instead</span> of you. 
                    By handling repetitive waste sorting tasks, improving safety conditions, and learning from every interaction, 
                    Ecosort helps humans focus on what they do best: <span className={styles.missionAccent}>create, solve, and innovate</span> for a sustainable future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section - Professional Smart Waste Classification Focus */}
        <div id="contact" className={styles.contactSection}>
          <div className={styles.contactContainer}>
            <div className={styles.contactWrapper}>
              {/* Section Header */}
              <div className={styles.contactHeader}>
                <div className={styles.contactTag}>
                  Get In Touch
                </div>
                <h2 className={styles.contactTitle}>
                  Ready to Transform Your
                  <br />
                  <span className={styles.contactTitleAccent}>Waste Management?</span>
                </h2>
                <p className={styles.contactDescription}>
                  Join thousands of organizations already using Ecosort to revolutionize their waste classification and environmental impact.
                </p>
              </div>

              <div className={styles.contactGrid}>
                {/* Left Side - Contact Form */}
                <div className={styles.contactForm}>
                  <h3 className={styles.formTitle}>Start Your Smart Waste Journey</h3>
                  <form className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={styles.formInput}
                          placeholder="John"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={styles.formInput}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={styles.formInput}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className={styles.formInput}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Waste Volume (Daily)</label>
                      <select 
                        value={formData.wasteVolume}
                        onChange={(e) => handleInputChange('wasteVolume', e.target.value)}
                        className={styles.formSelect}
                      >
                        <option value="">Select volume</option>
                        <option value="under-100kg">Under 100kg</option>
                        <option value="100kg-500kg">100kg - 500kg</option>
                        <option value="500kg-1ton">500kg - 1 ton</option>
                        <option value="1ton-5tons">1 ton - 5 tons</option>
                        <option value="over-5tons">Over 5 tons</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Message</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={styles.formTextarea}
                        placeholder="Tell us about your waste management challenges..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className={styles.submitButton}
                    >
                      Request Demo →
                    </button>
                  </form>
                </div>

                {/* Right Side - Information & Benefits */}
                <div className={styles.contactInfo}>
                  {/* Progress Dustbin */}
                  <div className={styles.progressCard}>
                    <h3 className={styles.progressTitle}>Form Progress</h3>
                    <div className={styles.progressContainer}>
                      <div className={styles.dustbinWrapper}>
                        {/* Dustbin Container */}
                        <div className={styles.dustbin}>
                          {/* Dustbin Lid */}
                          <div className={styles.dustbinLid}></div>
                          
                          {/* Waste Level - Fills based on progress */}
                          <div 
                            className={styles.wasteLevel}
                            style={{ height: `${getProgress()}%` }}
                          >
                            {/* Waste Items */}
                            {getProgress() > 0 && (
                              <div className={styles.wasteItems}>
                                {getProgress() > 16 && <span className={styles.wasteEmoji}>♻</span>}
                                {getProgress() > 33 && <span className={styles.wasteEmoji}>🗑️</span>}
                                {getProgress() > 50 && <span className={styles.wasteEmoji}>♻</span>}
                                {getProgress() > 66 && <span className={styles.wasteEmoji}>🗑️</span>}
                                {getProgress() > 83 && <span className={styles.wasteEmoji}>♻</span>}
                              </div>
                            )}
                          </div>
                          
                          {/* Progress Percentage */}
                          <div className={styles.progressPercentage}>
                            <div className={styles.progressValue}>{Math.round(getProgress())}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className={styles.benefitsCard}>
                    <h3 className={styles.benefitsTitle}>Why Choose Ecosort?</h3>
                    <div className={styles.benefitsList}>
                      <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <p className={styles.benefitText}>95% accuracy in waste classification</p>
                      </div>
                      <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <p className={styles.benefitText}>Reduce sorting time by 80%</p>
                      </div>
                      <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <p className={styles.benefitText}>Increase recycling rates by 40%</p>
                      </div>
                      <div className={styles.benefitItem}>
                        <div className={styles.benefitIcon}>
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <p className={styles.benefitText}>Real-time analytics and insights</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={styles.contactCard}>
                    <h3 className={styles.contactCardTitle}>Get Started Today</h3>
                    <div className={styles.contactList}>
                      <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <Mail className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <div className={styles.contactDetails}>
                          <p className={styles.contactLabel}>Email Us</p>
                          <p className={styles.contactValue}>admin@ecosort.com</p>
                        </div>
                      </div>
                      <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <Phone className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <div className={styles.contactDetails}>
                          <p className={styles.contactLabel}>Call Us</p>
                          <p className={styles.contactValue}>+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                          <Building2 className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <div className={styles.contactDetails}>
                          <p className={styles.contactLabel}>Visit Us</p>
                          <p className={styles.contactValue}>123 Green Street, Eco City</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
} 