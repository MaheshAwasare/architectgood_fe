import React, { useEffect, useRef } from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onViewBlog: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onViewBlog }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    // Add testimonials to sectionRefs
    if (sectionRefs.current.testimonials) {
      observer.observe(sectionRefs.current.testimonials);
    }

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
      if (sectionRefs.current.testimonials) {
        observer.unobserve(sectionRefs.current.testimonials);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white p-4 shadow-lg fixed w-full z-10 top-0 transition-all duration-300 ease-in-out">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => scrollToSection('home')} className="text-2xl font-extrabold text-primary tracking-wide focus:outline-none">
            ArchitectGood
          </button>
          <div className="space-x-6 flex items-center">
            <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </button>
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Features</span>
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>Services</span>
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 6c0 1.8.7 3.3 1.5 4.5 1 .8 1.5 2.1 1.5 3.5L12 22l3-8Z"/>
                <path d="M2 17h2c1.5 0 3-.5 4.5-1.3m8.5 1.3h2c1.5 0 3-.5 4.5-1.3"/>
              </svg>
              <span>How It Works</span>
            </button>
            
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.9 1.9 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>Contact</span>
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Testimonials</span>
            </button>
            {/* New Training Button */}
            <button onClick={() => window.location.href = '/training'} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.2 4.6a1 1 0 0 0-.4 0L2.6 9.084a1 1 0 0 0-.02 1.838l8.59 4.427a1 1 0 0 0 .82 0Z"/>
                <path d="M12 15.5v6"/>
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.2 4.6a1 1 0 0 0-.4 0L2.6 9.084a1 1 0 0 0-.02 1.838l8.59 4.427a1 1 0 0 0 .82 0Z" transform="translate(0 2)"/>
              </svg>
              <span>Training</span>
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Home) */}
      <section id="home" className="relative flex items-center justify-center h-screen pt-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-light to-primary opacity-70"></div> {/* Background gradient */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 L 0 10" fill="none" stroke="white" stroke-width="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="text-center px-4 relative z-10">
          <button
            onClick={() => scrollToSection('home')}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary animate-fade-in-down cursor-pointer"
          >
            ArchitectGood
          </button>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white animate-fade-in-up delay-200">
            Your AI-Powered Partner for Software Architecture, Diagramming, and Consulting.
          </p>
          <button
            onClick={onLogin}
            className="px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl animate-fade-in-up delay-400"
          >
            Login to Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={(el) => (sectionRefs.current.features = el)} className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1: AI-Powered Generation */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 transform hover:scale-105 transition duration-300 group">
              <div className="text-primary mb-4 text-5xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles">
                  <path d="M9.9 10.8c.3.9.9 1.6 1.6 1.6H12l-1.7 2.1c-.3.4-.6.8-.8 1.3-.2.5-.3 1-.3 1.6 0 .6.1 1.1.3 1.6.2.5.5.9.8 1.3l1.7 2.1h-1.6c-.7 0-1.3-.7-1.6-1.6-.3-.9-.9-1.6-1.6-1.6H8l1.7-2.1c.3-.4.6-.8.8-1.3.2-.5.3-1 .3-1.6 0-.6-.1-1.1-.3-1.6-.2-.5-.5-.9-.8-1.3L8 8.7h1.6c.7 0 1.3.7 1.6 1.6z"/>
                  <path d="M12 2v2"/>
                  <path d="M12 20v2"/>
                  <path d="M20 12h2"/>
                  <path d="M2 12h2"/>
                  <path d="m18.5 5.5-1.4 1.4"/>
                  <path d="m6.5 17.5-1.4 1.4"/>
                  <path d="m17.5 6.5 1.4-1.4"/>
                  <path d="m6.5 6.5 1.4-1.4"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">AI-Powered Generation</h3>
              <p className="text-gray-700 text-center">
                Leverage Google's Generative AI to effortlessly create code snippets, documentation, and complex diagrams from natural language descriptions.
              </p>
            </div>
            {/* Feature 2: Advanced Diagramming */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 transform hover:scale-105 transition duration-300 group">
              <div className="text-primary mb-4 text-5xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard">
                  <rect width="7" height="9" x="3" y="3" rx="1"/>
                  <rect width="7" height="5" x="14" y="3" rx="1"/>
                  <rect width="7" height="9" x="14" y="12" rx="1"/>
                  <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">Advanced Diagramming</h3>
              <p className="text-gray-700 text-center">
                Craft beautiful and precise Mermaid and PlantUML diagrams with a dedicated editor, complete with syntax highlighting, auto-completion, and validation.
              </p>
            </div>
            {/* Feature 3: Integrated Code Editor */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 transform hover:scale-105 transition duration-300 group">
              <div className="text-primary mb-4 text-5xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">Integrated Code Editor</h3>
              <p className="text-gray-700 text-center">
                Enjoy a powerful and customizable code editing experience with features like linting, search, and theme support, enhancing your productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={(el) => (sectionRefs.current.services = el)} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-500 to-blue-700 opacity-80"></div> {/* Very cool Background gradient */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hex-pattern" width="20" height="17.32" patternUnits="userSpaceOnUse">
              <path d="M10 0 L20 5 L20 15 L10 20 L0 15 L0 5 Z" fill="#fff" fill-opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
        </svg>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-white animate-fade-in-up">
            Our Comprehensive Services
          </h2>
          <div className="space-y-20">
            {/* Service 1: Software Architecture Designs */}
            <div className="flex flex-col md:flex-row items-center bg-neutral-50 p-10 rounded-3xl shadow-2xl border border-neutral-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-3xl group">
              <div className="md:w-1/3 flex justify-center mb-8 md:mb-0 md:pr-8">
                <div className="text-primary text-8xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                    <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                    <path d="M10 6h4"/>
                    <path d="M10 10h4"/>
                    <path d="M10 14h4"/>
                    <path d="M10 18h4"/>
                  </svg>
                </div>
              </div>
              <div className="md:w-2/3 text-center md:text-left">
                <h3 className="text-4xl font-extrabold mb-4 text-primary leading-tight">Software Architecture Designs</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We craft robust, scalable, and future-proof software architectures tailored to your unique business needs. Our designs ensure high performance, maintainability, and security from the ground up.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-left mx-auto md:mx-0 max-w-md">
                  <li>System Design & Blueprinting</li>
                  <li>Technology Stack Selection & Optimization</li>
                  <li>Scalability & Performance Architecture</li>
                  <li>Security & Compliance Design</li>
                  <li>Microservices & Distributed Systems</li>
                </ul>
              </div>
            </div>

            {/* Service 2: Professional Consulting */}
            <div className="flex flex-col md:flex-row items-center bg-neutral-50 p-10 rounded-3xl shadow-2xl border border-neutral-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-3xl group">
              <div className="md:w-1/3 flex justify-center mb-8 md:mb-0 md:pr-8">
                <div className="text-primary text-8xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
              <div className="md:w-2/3 text-center md:text-left">
                <h3 className="text-4xl font-extrabold mb-4 text-primary leading-tight">Professional Consulting & Advisory</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-left">
                  Leverage our deep industry expertise to navigate complex technical challenges. We provide strategic guidance, best practices, and hands-on support to accelerate your projects and empower your teams.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-left mx-auto md:mx-0 max-w-md">
                  <li>Code Review & Technical Debt Reduction</li>
                  <li>Agile & DevOps Transformation</li>
                  <li>Cloud Strategy & Migration (AWS, Azure, GCP)</li>
                  <li>Technical Leadership & Mentoring Programs</li>
                  <li>Innovation & R&D Advisory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* About Us Section */}
      <section id="about" ref={(el) => (sectionRefs.current.about = el)} className="relative py-20 overflow-hidden mb-20">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-dark to-primary-light opacity-80"></div> {/* Background gradient */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="triangle-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M5 0 L10 10 L0 10 Z" fill="#fff" fill-opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangle-pattern)" />
        </svg>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-white flex items-center justify-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <span>Our Vision: Innovating Software Architecture with AI</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="md:w-1/2 text-left">
              <p className="text-lg text-white leading-relaxed mb-6">
                At ArchitectGood, we believe in empowering developers and architects to build the future. Our platform seamlessly integrates cutting-edge AI with intuitive design tools, transforming complex architectural challenges into streamlined, collaborative workflows. We're dedicated to fostering innovation, ensuring scalability, and simplifying the art of software design.
              </p>
              <p className="text-lg text-white leading-relaxed">
                Join us in redefining how software is conceptualized, designed, and brought to life.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              {/* Placeholder for a more complex SVG illustration */}
              <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-white opacity-70">
                <circle cx="100" cy="100" r="80" stroke-dasharray="5 5" />
                <line x1="20" y1="100" x2="180" y2="100" />
                <line x1="100" y1="20" x2="100" y2="180" />
                <circle cx="100" cy="100" r="10" fill="currentColor" />
                <path d="M50 50 Q100 0 150 50" />
                <path d="M50 150 Q100 200 150 150" />
                <path d="M50 50 L150 150" />
                <path d="M150 50 L50 150" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pillar 1: AI-Powered Intelligence */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 text-center transform hover:scale-105 transition duration-300">
              <div className="text-primary mb-4 text-4xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles">
                  <path d="M9.9 10.8c.3.9.9 1.6 1.6 1.6H12l-1.7 2.1c-.3.4-.6.8-.8 1.3-.2.5-.3 1-.3 1.6 0 .6.1 1.1.3 1.6.2.5.5.9.8 1.3l1.7 2.1h-1.6c-.7 0-1.3-.7-1.6-1.6-.3-.9-.9-1.6-1.6-1.6H8l1.7-2.1c.3-.4.6-.8.8-1.3.2-.5.3-1 .3-1.6 0-.6-.1-1.1-.3-1.6-.2-.5-.5-.9-.8-1.3L8 8.7h1.6c.7 0 1.3.7 1.6 1.6z"/>
                  <path d="M12 2v2"/>
                  <path d="M12 20v2"/>
                  <path d="M20 12h2"/>
                  <path d="M2 12h2"/>
                  <path d="m18.5 5.5-1.4 1.4"/>
                  <path d="m6.5 17.5-1.4 1.4"/>
                  <path d="m17.5 6.5 1.4-1.4"/>
                  <path d="m6.5 6.5 1.4-1.4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">AI-Powered Intelligence</h3>
              <p className="text-gray-700 text-sm">Leverage advanced AI to generate code, diagrams, and insights, accelerating your design process.</p>
            </div>

           

            {/* Pillar 3: Robust System Design */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 text-center transform hover:scale-105 transition duration-300">
              <div className="text-primary mb-4 text-4xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/>
                  <path d="M10 10h4"/>
                  <path d="M10 14h4"/>
                  <path d="M10 18h4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Robust System Design</h3>
              <p className="text-gray-700 text-sm">Craft resilient, scalable, and secure architectures with our comprehensive suite of diagramming and modeling tools.</p>
            </div>

            {/* Pillar 4: Visual Clarity */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-200 text-center transform hover:scale-105 transition duration-300">
              <div className="text-primary mb-4 text-4xl flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard">
                  <rect width="7" height="9" x="3" y="3" rx="1"/>
                  <rect width="7" height="5" x="14" y="3" rx="1"/>
                  <rect width="7" height="9" x="14" y="12" rx="1"/>
                  <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">Visual Clarity</h3>
              <p className="text-gray-700 text-sm">Transform abstract concepts into clear, understandable diagrams, making complex systems accessible to everyone.</p>
            </div>
          </div>
        </div>
      </section>
     

      {/* How It Works: Mermaid & UML Section */}
      <section id="how-it-works" ref={(el) => (sectionRefs.current.howItWorks = el)} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-neutral-100 opacity-80"></div> {/* Background color */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dot-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#999" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
        <div className="container mx-auto px-6 relative z-10"> {/* Added relative z-10 to content */}
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary flex items-center justify-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-branch-plus">
              <path d="M6 3v12"/>
              <path d="M18 9v12"/>
              <path d="M12 6v.01"/>
              <path d="M12 18v.01"/>
              <path d="M6 15a6 6 0 0 0 12 0"/>
              <path d="M12 12h6"/>
              <path d="M15 9v6"/>
            </svg>
            <span>How It Works: Diagram Generation</span>
          </h2>

          {/* New Illustrative SVG Diagram */}
          <div className="flex justify-center mb-16">
            <svg width="600" height="225" viewBox="0 0 600 225" xmlns="http://www.w3.org/2000/svg">
              {/* Text Input */}
              <rect x="30" y="75" width="150" height="75" rx="15" ry="15" fill="#fff" stroke="#3b82f6" stroke-width="3"/>
              <text x="105" y="120" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Text Input</text>

              {/* Arrow 1 */}
              <line x1="180" y1="112.5" x2="270" y2="112.5" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowhead)"/>

              {/* Process */}
              <circle cx="300" cy="112.5" r="45" fill="#fff" stroke="#3b82f6" stroke-width="3"/>
              <text x="300" y="120" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Process</text>

              {/* Arrow 2 */}
              <line x1="345" y1="112.5" x2="435" y2="112.5" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowhead)"/>

              {/* Diagram Output */}
              <rect x="450" y="75" width="120" height="75" rx="15" ry="15" fill="#fff" stroke="#3b82f6" stroke-width="3"/>
              <path d="M465 90 L555 90 L555 135 L465 135 Z M510 90 L510 135 M465 112.5 L555 112.5" fill="none" stroke="#333" stroke-width="1.5"/>
              <text x="510" y="120" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Diagram</text>

              {/* Arrowhead definition */}
              <defs>
                <marker id="arrowhead" markerWidth="15" markerHeight="10.5" refX="0" refY="5.25" orient="auto">
                  <polygon points="0 0, 15 5.25, 0 10.5" fill="#3b82f6" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="space-y-12">
            {/* Mermaid Explanation */}
            <div className="flex flex-col md:flex-row items-center bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 group">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <h3 className="text-3xl font-semibold mb-4 text-primary">Mermaid Diagrams Made Easy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mermaid is a JavaScript-based diagramming and charting tool that renders Markdown-inspired text definitions to create diagrams dynamically in the browser. With ArchitectGood, you can:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                  <li>Write simple text to generate complex flowcharts, sequence diagrams, class diagrams, and more.</li>
                  <li>Utilize our AI Mermaid Generator to describe your diagram in natural language and let AI write the Mermaid code for you.</li>
                  <li>Benefit from syntax highlighting, auto-completion, and real-time preview in our dedicated Mermaid editor.</li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <pre className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto border border-gray-300">
                  <code className="text-gray-800">
{`graph TD
    A[Start] --> B{Decision}
    B -->|One| C[Process 1]
    B -->|Two| D[Process 2]
    C --> E[End]
    D --> E`}
                  </code>
                </pre>
              </div>
            </div>

            {/* UML Explanation */}
            <div className="flex flex-col md:flex-row-reverse items-center bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 group">
              <div className="md:w-1/2 md:pl-8 mb-6 md:mb-0">
                <h3 className="text-3xl font-semibold mb-4 text-primary">UML Diagrams with AI Assistance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unified Modeling Language (UML) is a standard for visualizing, specifying, constructing, and documenting the artifacts of a software-intensive system. ArchitectGood simplifies UML creation:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
                  <li>Generate various UML diagrams like class diagrams, use case diagrams, and activity diagrams.</li>
                  <li>Our AI UML Generator can interpret your requirements and translate them into accurate UML representations.</li>
                  <li>Integrate with PlantUML for text-based UML generation, offering flexibility and version control.</li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <pre className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto border border-gray-300">
                  <code className="text-gray-800">
{`@startuml
class "User" {
  + name: String
  + email: String
  + login()
}

class "Product" {
  + name: String
  + price: Double
}

User "1" -- "*" Product : owns
@enduml`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      

    

       <section id="testimonials" ref={(el) => (sectionRefs.current.testimonials = el)} className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary flex items-center justify-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote-left">
              <path d="M10.3 2.6a1 1 0 0 1 1.7.7L13 6.5a1 1 0 0 1-.7 1.7l-2.9-.7a1 1 0 0 1-.7-1.7l.7-2.9a1 1 0 0 1 1.7-.7z"/>
              <path d="M10.3 13.6a1 1 0 0 1 1.7.7L13 17.5a1 1 0 0 1-.7 1.7l-2.9-.7a1 1 0 0 1-.7-1.7l.7-2.9a1 1 0 0 1 1.7-.7z"/>
            </svg>
            <span>What Users Say</span>
          </h2>

          {/* New Illustrative SVG Diagram for Testimonials */}
          <div className="flex justify-center mb-16">
            <svg width="600" height="200" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
              {/* Speech Bubble 1 */}
              <rect x="20" y="20" width="160" height="80" rx="20" ry="20" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="60" cy="110" r="10" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <line x1="60" y1="100" x2="80" y2="120" stroke="#3b82f6" stroke-width="2"/>
              <text x="100" y="70" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Great!</text>

              {/* Speech Bubble 2 */}
              <rect x="220" y="60" width="160" height="80" rx="20" ry="20" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="260" cy="150" r="10" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <line x1="260" y1="140" x2="280" y2="160" stroke="#3b82f6" stroke-width="2"/>
              <text x="300" y="110" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Awesome!</text>

              {/* Speech Bubble 3 */}
              <rect x="420" y="20" width="160" height="80" rx="20" ry="20" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="460" cy="110" r="10" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
              <line x1="460" y1="100" x2="480" y2="120" stroke="#3b82f6" stroke-width="2"/>
              <text x="500" y="70" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">Fantastic!</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 flex flex-col items-center text-center">
              <p className="text-lg text-gray-700 italic mb-6">
                "ArchitectGood transformed our development process. Their AI tools are incredibly powerful, and their consulting services are top-notch. Highly recommended!"
              </p>
              <p className="font-semibold text-primary-dark">— Mahesh A (Architect)</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 flex flex-col items-center text-center">
              <p className="text-lg text-gray-700 italic mb-6">
                "The diagramming tools are a game-changer. We can now visualize complex systems with ease, and the AI assistance saves us countless hours."
              </p>
              <p className="font-semibold text-primary-dark">— SP, Lead Architect at Innovate Corp</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 flex flex-col items-center text-center">
              <p className="text-lg text-gray-700 italic mb-6">
                "Their team's expertise in software architecture is unparalleled. They helped us navigate critical design decisions and set us up for long-term success."
              </p>
              <p className="font-semibold text-primary-dark">— NV, Architect at Avaloq</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={(el) => (sectionRefs.current.contact = el)} className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 opacity-80"></div> {/* Background gradient */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hex-pattern" width="20" height="17.32" patternUnits="userSpaceOnUse">
              <path d="M10 0 L20 5 L20 15 L10 20 L0 15 L0 5 Z" fill="#fff" fill-opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-pattern)" />
        </svg>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary flex items-center justify-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.9 1.9 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>Get in Touch</span>
          </h2>
          <p className="text-lg text-white mb-8"> {/* Changed text color to white */}
            Have questions, feedback, or just want to say hello? We'd love to hear from you!
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a href="mailto:info@architectgood.com" className="text-white hover:text-primary-light transition-colors duration-300 text-xl font-medium"> {/* Changed text color to white */}
              info@architectgood.com
            </a>
            <p className="text-white text-lg">Pune, Maharashtra, India</p> {/* Changed text color to white */}
            <p className="text-white text-lg">+91 9881499363</p> {/* Changed text color to white */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-neutral-100 text-center">
        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary flex items-center justify-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rocket">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74.5 5 2c1.26-1.5 5-2 5-2s-.5-3.74-2-5c1.5-1.26 2-5 2-5s-3.74-.5-5-2c-1.26 1.5-5 2-5 2s.5 3.74 2 5Z"/>
            <path d="M9 18v3c0 .5-.5 1-1 1H6s-1 0-1-1v-3c0-.5.5-1 1-1h2c.5 0 1 .5 1 1Z"/>
            <path d="M12 15h4c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1h-4c-.5 0-1-.5-1-1v-2c0-.5.5-1 1-1Z"/>
            <path d="M18 12h3c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1h-3c-.5 0-1-.5-1-1v-2c0-.5.5-1 1-1Z"/>
          </svg>
          <span>Ready to Transform Your Workflow?</span>
        </h2>
        <button
          onClick={onLogin}
          className="px-10 py-5 bg-primary text-white font-semibold rounded-full shadow-xl hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
        >
          Start Designing Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-neutral-200 text-center text-gray-600 text-sm">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
            <i className="lucide lucide-linkedin" size={24}></i>
          </a>
          <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
            <i className="lucide lucide-twitter" size={24}></i>
          </a>
          <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-300">
            <i className="lucide lucide-github" size={24}></i>
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} ArchitectGood. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;