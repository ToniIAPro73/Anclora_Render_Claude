import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Check, Star, Zap, Shield, Globe, Code, 
  Palette, Eye, Sparkles, Users, TrendingUp, Award, ChevronRight,
  MessageSquare, Clock, Target, Layers, Moon, Sun
} from 'lucide-react';

const AncloraLandingPage = () => {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Frontend Developer at Stripe",
      avatar: "SC",
      content: "Anclora Render reduced our component development time by 70%. The AI understands our design system perfectly and generates pixel-perfect components every time.",
      rating: 5
    },
    {
      name: "Miguel Rodriguez", 
      role: "Design System Lead at Shopify",
      avatar: "MR",
      content: "Finally, a tool that actually enforces design system consistency. No more manual reviews - everything comes out compliant with our standards automatically.",
      rating: 5
    },
    {
      name: "Alex Thompson",
      role: "CTO at TechFlow",
      avatar: "AT", 
      content: "Setup took literally 30 seconds vs the 8+ hours we spent on Storybook. Our entire team was productive from day one. This is the future of component development.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI Component Generation",
      description: "Describe components in natural language and get production-ready code in seconds"
    },
    {
      icon: Palette,
      title: "Design System Enforcement", 
      description: "Automatically applies your brand colors, typography, and spacing rules to every component"
    },
    {
      icon: Globe,
      title: "Universal Framework Support",
      description: "Works with React, Vue, Angular, and vanilla CSS - no lock-in, maximum flexibility"
    },
    {
      icon: Eye,
      title: "Live Preview & Testing",
      description: "See your components across mobile, tablet, and desktop with real-time validation"
    },
    {
      icon: Shield,
      title: "Accessibility Built-in",
      description: "WCAG 2.2 compliance, keyboard navigation, and screen reader support automatically included"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimized",
      description: "Generated components are automatically optimized for speed and best practices"
    }
  ];

  const stats = [
    { number: "30s", label: "Setup Time" },
    { number: "70%", label: "Faster Development" },
    { number: "100%", label: "Design System Compliance" },
    { number: "500+", label: "Components Generated Daily" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for individual developers and side projects",
      features: [
        "50 components per month",
        "3 design systems",
        "Basic component library",
        "Community support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For professional developers and small teams",
      features: [
        "Unlimited components",
        "Unlimited design systems", 
        "Advanced component library",
        "Figma plugin access",
        "VS Code extension",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large teams and organizations",
      features: [
        "Everything in Pro",
        "White-label deployment",
        "SSO + advanced security",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const handleEmailSignup = () => {
    if (isEmailValid) {
      // Handle email signup
      alert(`Thanks for signing up with ${email}! We'll send you early access.`);
      setEmail('');
    }
  };

  return (
    <div className={`landing-page ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav">
            <div className="logo">
              <div className="logo-icon">A</div>
              <span className="logo-text">Anclora Render</span>
            </div>
            
            <nav className="nav-links">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#testimonials">Reviews</a>
              <a href="https://docs.anclora.com">Docs</a>
            </nav>

            <div className="nav-actions">
              <button 
                className="theme-toggle"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="btn btn-outline">Login</button>
              <button className="btn btn-primary">Start Free</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Award size={16} />
              <span>Featured on Product Hunt • #1 Developer Tool</span>
            </div>

            <h1 className="hero-title">
              The AI-Powered Design System
              <span className="gradient-text"> Truth Engine</span>
            </h1>

            <p className="hero-description">
              Generate pixel-perfect UI components from natural language descriptions. 
              Automatically follows your design system. Works with any framework. 
              <strong>Setup in 30 seconds.</strong>
            </p>

            <div className="hero-cta">
              <div className="email-signup">
                <input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`email-input ${isEmailValid ? 'valid' : ''}`}
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleEmailSignup}
                  disabled={!isEmailValid}
                >
                  Get Early Access
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="signup-note">
                <Check size={14} />
                Free forever plan • No credit card required
              </p>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="demo-container">
              <div className="demo-header">
                <div className="demo-controls">
                  <div className="control red"></div>
                  <div className="control yellow"></div>
                  <div className="control green"></div>
                </div>
                <div className="demo-title">Anclora Render</div>
              </div>
              
              <div className="demo-content">
                <div className="chat-message user">
                  <div className="message-avatar">👤</div>
                  <div className="message-text">
                    Create a product card with image, title, price, and buy button
                  </div>
                </div>
                
                <div className="chat-message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-text">
                    Perfect! I'll create a responsive product card following your Anclora design system...
                  </div>
                </div>

                <div className="generated-component">
                  <div className="component-preview">
                    <div className="product-card">
                      <div className="card-image"></div>
                      <div className="card-content">
                        <h3>Premium Headphones</h3>
                        <p className="price">$299</p>
                        <button className="buy-btn">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="video-demo">
        <div className="container">
          <div className="section-header">
            <h2>See Anclora Render in Action</h2>
            <p>Watch how easy it is to generate production-ready components with AI</p>
          </div>
          
          <div className="video-container">
            <div className="video-thumbnail">
              {!isVideoPlaying ? (
                <div className="play-overlay" onClick={() => setIsVideoPlaying(true)}>
                  <div className="play-button">
                    <Play size={24} />
                  </div>
                  <div className="video-duration">2:30</div>
                </div>
              ) : (
                <div className="video-player">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Anclora Render Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Build Better Components</h2>
            <p>Powerful features that make component development faster, more consistent, and more enjoyable</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Anclora Render?</h2>
            <p>See how we compare to traditional component development tools</p>
          </div>

          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell"></div>
              <div className="comparison-cell">
                <div className="product-logo">
                  <div className="logo-icon small">A</div>
                  <span>Anclora Render</span>
                </div>
              </div>
              <div className="comparison-cell">Storybook</div>
              <div className="comparison-cell">Figma Dev Mode</div>
              <div className="comparison-cell">Chromatic</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell feature">Setup Time</div>
              <div className="comparison-cell winner">30 seconds</div>
              <div className="comparison-cell">4-8 hours</div>
              <div className="comparison-cell">Immediate*</div>
              <div className="comparison-cell">2-4 hours</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell feature">AI Generation</div>
              <div className="comparison-cell winner"><Check size={16} /></div>
              <div className="comparison-cell">❌</div>
              <div className="comparison-cell">Basic</div>
              <div className="comparison-cell">❌</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell feature">Multi-Framework</div>
              <div className="comparison-cell winner"><Check size={16} /></div>
              <div className="comparison-cell"><Check size={16} /></div>
              <div className="comparison-cell">Figma only</div>
              <div className="comparison-cell"><Check size={16} /></div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell feature">Design System Enforcement</div>
              <div className="comparison-cell winner">Automatic</div>
              <div className="comparison-cell">Manual</div>
              <div className="comparison-cell">Limited</div>
              <div className="comparison-cell">Visual only</div>
            </div>

            <div className="comparison-row">
              <div className="comparison-cell feature">Starting Price</div>
              <div className="comparison-cell winner">Free</div>
              <div className="comparison-cell">Free</div>
              <div className="comparison-cell">$12/month</div>
              <div className="comparison-cell">$149/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Developers Worldwide</h2>
            <p>Join thousands of developers who've revolutionized their component workflow</p>
          </div>

          <div className="testimonial-carousel">
            <div className="testimonial-card active">
              <div className="testimonial-content">
                <div className="stars">
                  {Array.from({length: testimonials[currentTestimonial].rating}).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>"{testimonials[currentTestimonial].content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonials[currentTestimonial].name}</div>
                    <div className="author-role">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free and scale as you grow. No hidden fees, cancel anytime.</p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-full`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="pricing-faq">
            <p>Questions? Check our <a href="#faq">FAQ</a> or <a href="#contact">contact sales</a></p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Component Development?</h2>
            <p>Join thousands of developers building better UIs faster with AI-powered components</p>
            
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">
                Start Building for Free
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-outline btn-large">
                Schedule Demo
                <MessageSquare size={20} />
              </button>
            </div>

            <div className="cta-features">
              <div className="cta-feature">
                <Clock size={16} />
                <span>Setup in 30 seconds</span>
              </div>
              <div className="cta-feature">
                <Shield size={16} />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <Users size={16} />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon">A</div>
                <span className="logo-text">Anclora Render</span>
              </div>
              <p>The AI-powered design system truth engine for modern developers.</p>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="/changelog">Changelog</a>
                <a href="/roadmap">Roadmap</a>
              </div>
              <div className="link-group">
                <h4>Resources</h4>
                <a href="/docs">Documentation</a>
                <a href="/blog">Blog</a>
                <a href="/examples">Examples</a>
                <a href="/api">API Reference</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="/careers">Careers</a>
                <a href="/contact">Contact</a>
                <a href="/privacy">Privacy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Anclora. All rights reserved.</p>
            <div className="footer-social">
              <a href="https://twitter.com/anclora" aria-label="Twitter">𝕏</a>
              <a href="https://github.com/anclora" aria-label="GitHub">GitHub</a>
              <a href="https://discord.gg/anclora" aria-label="Discord">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        /* Variables */
        .landing-page.light {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8FAFC;
          --bg-tertiary: #E2E8F0;
          --text-primary: #0F172A;
          --text-secondary: #334155;
          --text-muted: #64748B;
          --border: #E2E8F0;
          --shadow: rgba(0, 0, 0, 0.1);
          --shadow-lg: rgba(0, 0, 0, 0.15);
        }

        .landing-page.dark {
          --bg-primary: #0D1117;
          --bg-secondary: #161B22;
          --bg-tertiary: #21262D;
          --text-primary: #F8FAFC;
          --text-secondary: #E2E8F0;
          --text-muted: #94A3B8;
          --border: #30363D;
          --shadow: rgba(0, 0, 0, 0.3);
          --shadow-lg: rgba(0, 0, 0, 0.4);
        }

        :root {
          --brand-700: #213A57;
          --brand-600: #0B6477;
          --brand-500: #14919B;
          --brand-400: #0AD1C8;
          --brand-300: #45DFB1;
          --brand-200: #80ED99;
          --grad-ocean: linear-gradient(120deg, #80ED99 0%, #45DFB1 22%, #0AD1C8 45%, #14919B 65%, #0B6477 82%, #213A57 100%);
          --grad-ocean-subtle: linear-gradient(135deg, rgba(10, 209, 200, 0.1), rgba(69, 223, 177, 0.1));
        }

        /* Base styles */
        .landing-page {
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
          padding: 1rem 0;
        }

        .landing-page.dark .header {
          background: rgba(13, 17, 23, 0.8);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--grad-ocean);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }

        .logo-icon.small {
          width: 24px;
          height: 24px;
          font-size: 0.8rem;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: var(--brand-600);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .theme-toggle {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: var(--brand-400);
          color: white;
        }

        /* Hero Section */
        .hero {
          padding: 6rem 0 4rem;
          background: 
            radial-gradient(circle at 30% 20%, rgba(10, 209, 200, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(69, 223, 177, 0.1) 0%, transparent 50%);
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--grad-ocean-subtle);
          border: 1px solid var(--brand-300);
          border-radius: 24px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--brand-700);
          margin-bottom: 2rem;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .gradient-text {
          background: var(--grad-ocean);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          margin-bottom: 4rem;
        }

        .email-signup {
          display: flex;
          max-width: 500px;
          margin: 0 auto 1rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 0.5rem;
          transition: border-color 0.2s ease;
        }

        .email-signup:focus-within {
          border-color: var(--brand-400);
        }

        .email-input {
          flex: 1;
          background: none;
          border: none;
          padding: 0.75rem;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .email-input:focus {
          outline: none;
        }

        .email-input.valid {
          color: var(--brand-600);
        }

        .signup-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--brand-600);
          font-family: 'Space Grotesk', sans-serif;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .hero-visual {
          max-width: 800px;
          margin: 0 auto;
        }

        .demo-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 20px 40px var(--shadow-lg);
          overflow: hidden;
        }

        .demo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
        }

        .demo-controls {
          display: flex;
          gap: 0.5rem;
        }

        .control {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .control.red { background: #FF5F57; }
        .control.yellow { background: #FFBD2E; }
        .control.green { background: #28CA42; }

        .demo-title {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .demo-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .chat-message {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .chat-message.user .message-avatar {
          background: var(--brand-400);
        }

        .chat-message.assistant .message-avatar {
          background: var(--grad-ocean);
        }

        .message-text {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          flex: 1;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .generated-component {
          background: var(--bg-primary);
          border: 2px solid var(--brand-300);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .component-preview {
          display: flex;
          justify-content: center;
        }

        .product-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          width: 250px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-image {
          height: 160px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--brand-600);
          margin: 0 0 1rem;
        }

        .buy-btn {
          width: 100%;
          background: var(--brand-600);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .buy-btn:hover {
          background: var(--brand-500);
        }

        /* Video Demo */
        .video-demo {
          padding: 6rem 0;
          background: var(--bg-secondary);
        }

        .video-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--grad-ocean);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px var(--shadow-lg);
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.2);
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-600);
          transition: transform 0.2s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
        }

        .video-duration {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .video-player {
          width: 100%;
          height: 100%;
        }

        /* Section headers */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin: 0 0 1rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .section-header p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Features */
        .features {
          padding: 6rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
        }

        .feature-card {
          text-align: center;
          padding: 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px var(--shadow-lg);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          background: var(--grad-ocean-subtle);
          border: 1px solid var(--brand-300);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--brand-600);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem;
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Comparison */
        .comparison {
          padding: 6rem 0;
          background: var(--bg-secondary);
        }

        .comparison-table {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px var(--shadow);
        }

        .comparison-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr;
          align-items: center;
          min-height: 60px;
        }

        .comparison-row.header {
          background: var(--bg-tertiary);
          font-weight: 600;
        }

        .comparison-row:not(.header) {
          border-top: 1px solid var(--border);
        }

        .comparison-cell {
          padding: 1rem;
          text-align: center;
        }

        .comparison-cell.feature {
          text-align: left;
          font-weight: 500;
        }

        .comparison-cell.winner {
          background: var(--grad-ocean-subtle);
          color: var(--brand-700);
          font-weight: 600;
        }

        .product-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        /* Testimonials */
        .testimonials {
          padding: 6rem 0;
        }

        .testimonial-carousel {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .testimonial-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 8px 24px var(--shadow);
        }

        .stars {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 2rem;
          color: #fbbf24;
        }

        .testimonial-content p {
          font-size: 1.25rem;
          line-height: 1.6;
          margin: 0 0 2rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          background: var(--grad-ocean);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .author-info {
          text-align: left;
        }

        .author-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-role {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .testimonial-indicators {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--border);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .indicator.active {
          background: var(--brand-400);
        }

        /* Pricing */
        .pricing {
          padding: 6rem 0;
          background: var(--bg-secondary);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .pricing-card {
          background: var(--bg-primary);
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px var(--shadow-lg);
        }

        .pricing-card.popular {
          border-color: var(--brand-400);
          transform: scale(1.05);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--grad-ocean);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .plan-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1rem;
        }

        .plan-price {
          margin-bottom: 1rem;
        }

        .price {
          font-size: 3rem;
          font-weight: 800;
          color: var(--brand-600);
          font-family: 'Space Grotesk', sans-serif;
        }

        .period {
          font-size: 1rem;
          color: var(--text-muted);
        }

        .plan-description {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }

        .plan-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .plan-features li:last-child {
          border-bottom: none;
        }

        .plan-features svg {
          color: var(--brand-400);
          flex-shrink: 0;
        }

        .pricing-faq {
          text-align: center;
          color: var(--text-muted);
        }

        .pricing-faq a {
          color: var(--brand-600);
          text-decoration: none;
        }

        .pricing-faq a:hover {
          text-decoration: underline;
        }

        /* Final CTA */
        .final-cta {
          padding: 8rem 0;
          background: var(--grad-ocean);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin: 0 0 1rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .cta-content p {
          font-size: 1.25rem;
          margin: 0 0 3rem;
          opacity: 0.9;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .cta-features {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.9;
        }

        /* Footer */
        .footer {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border);
          padding: 4rem 0 2rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand p {
          color: var(--text-secondary);
          margin: 1rem 0 0;
          line-height: 1.6;
        }

        .link-group h4 {
          font-weight: 600;
          margin: 0 0 1rem;
        }

        .link-group a {
          display: block;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 0.5rem 0;
          transition: color 0.2s ease;
        }

        .link-group a:hover {
          color: var(--brand-600);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .footer-bottom p {
          margin: 0;
          color: var(--text-muted);
        }

        .footer-social {
          display: flex;
          gap: 1rem;
        }

        .footer-social a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-social a:hover {
          color: var(--brand-600);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          text-decoration: none;
          justify-content: center;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .btn-full {
          width: 100%;
        }

        .btn-primary {
          background: var(--brand-600);
          color: white;
          border-color: var(--brand-600);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--brand-500);
          border-color: var(--brand-500);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(11, 100, 119, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-outline {
          background: transparent;
          color: var(--brand-600);
          border-color: var(--brand-400);
        }

        .btn-outline:hover {
          background: var(--brand-400);
          color: white;
          transform: translateY(-1px);
        }

        .final-cta .btn-outline {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .final-cta .btn-outline:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .nav {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .nav-links {
            order: 3;
            width: 100%;
            justify-content: center;
            gap: 1rem;
          }

          .hero {
            padding: 4rem 0 2rem;
          }

          .hero-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .demo-content {
            padding: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .comparison-table {
            overflow-x: auto;
          }

          .comparison-row {
            min-width: 700px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.popular {
            transform: none;
          }

          .cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .cta-features {
            flex-direction: column;
            gap: 1rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .landing-page *:focus-visible {
          outline: 2px solid var(--brand-400);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default AncloraLandingPage;