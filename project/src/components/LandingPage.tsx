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
          <div className="text-2xl font-extrabold text-primary tracking-wide">
            ArchitectGood
          </div>
          <div className="space-x-6 flex items-center">
            <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Features
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              How It Works
            </button>
            <button onClick={onViewBlog} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Blog
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Contact
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Testimonials
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Home) */}
      <section id="home" className="relative flex items-center justify-center h-screen pt-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550439062-609e1d87538e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Software Architecture and AI"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for text readability */}
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
              <div className="text-primary mb-4 text-5xl flex justify-center"><i className="lucide lucide-sparkles"></i></div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">AI-Powered Generation</h3>
              <p className="text-gray-700 text-center">
                Leverage Google's Generative AI to effortlessly create code snippets, documentation, and complex diagrams from natural language descriptions.
              </p>
            </div>
            {/* Feature 2: Advanced Diagramming */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 transform hover:scale-105 transition duration-300 group">
              <div className="text-primary mb-4 text-5xl flex justify-center"><i className="lucide lucide-layout-dashboard"></i></div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">Advanced Diagramming</h3>
              <p className="text-gray-700 text-center">
                Craft beautiful and precise Mermaid and PlantUML diagrams with a dedicated editor, complete with syntax highlighting, auto-completion, and validation.
              </p>
            </div>
            {/* Feature 3: Integrated Code Editor */}
            <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 transform hover:scale-105 transition duration-300 group">
              <div className="text-primary mb-4 text-5xl flex justify-center"><i className="lucide lucide-code"></i></div>
              <h3 className="text-2xl font-semibold mb-4 text-primary text-center">Integrated Code Editor</h3>
              <p className="text-gray-700 text-center">
                Enjoy a powerful and customizable code editing experience with features like linting, search, and theme support, enhancing your productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={(el) => (sectionRefs.current.services = el)} className="py-20 bg-gradient-to-br from-white to-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 34v-4h-2v4H6v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4H6v2h4v4h2v-4h4v-2h-4z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary animate-fade-in-up">
            Our Comprehensive Services
          </h2>
          <div className="space-y-20">
            {/* Service 1: Software Architecture Designs */}
            <div className="flex flex-col md:flex-row items-center bg-neutral-50 p-10 rounded-3xl shadow-2xl border border-neutral-200 transform transition duration-500 hover:scale-[1.02] hover:shadow-3xl group">
              <div className="md:w-1/3 flex justify-center mb-8 md:mb-0 md:pr-8">
                <div className="text-primary text-8xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <i className="lucide lucide-building-2"></i>
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
                  <i className="lucide lucide-users"></i>
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

      {/* Testimonials Section */}
      <section id="testimonials" ref={(el) => (sectionRefs.current.testimonials = el)} className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            What Users Say
          </h2>
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

      {/* How It Works: Mermaid & UML Section */}
      <section id="how-it-works" ref={(el) => (sectionRefs.current.howItWorks = el)} className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            How It Works: Diagram Generation
          </h2>
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

      {/* Blog Section */}
      <section id="blog" ref={(el) => (sectionRefs.current.blog = el)} className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            Our Blog
          </h2>
          <div className="bg-neutral-50 p-8 rounded-xl shadow-lg border border-neutral-200 text-left">
            <h3 className="text-3xl font-semibold mb-4 text-primary">The Importance of Software Architecture in Modern Development</h3>
            <p className="text-gray-600 text-sm mb-4">August 24, 2025 | By ArchitectGood Team</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              In today's rapidly evolving technological landscape, software architecture stands as the backbone of any successful application. It's not just about writing code; it's about designing a robust, scalable, and maintainable system that can adapt to future demands.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              A well-defined architecture provides a clear roadmap for development, minimizes technical debt, and facilitates collaboration among large teams. It addresses critical concerns such as performance, security, reliability, and cost-effectiveness from the outset.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              At ArchitectGood, we believe that investing in sound software architecture is paramount. Our tools and consulting services are designed to help you lay a solid foundation for your projects, ensuring long-term success and innovation. From microservices to monolithic applications, understanding the architectural patterns and principles is key to building resilient software.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Stay tuned for more insights on architectural patterns, design principles, and best practices in our upcoming blog posts!
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" ref={(el) => (sectionRefs.current.about = el)} className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            About ArchitectGood
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ArchitectGood is a cutting-edge platform designed to streamline the process of software architecture and design. We empower developers, architects, and teams to visualize complex systems with ease, generate code and diagrams using advanced AI, and collaborate seamlessly. Our mission is to bridge the gap between ideas and implementation, making design more accessible and efficient.
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mt-4">
            Built with modern web technologies and powered by Google's Generative AI, ArchitectGood is constantly evolving to meet the demands of the fast-paced tech world. Join us in shaping the future of software design.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={(el) => (sectionRefs.current.contact = el)} className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Have questions, feedback, or just want to say hello? We'd love to hear from you!
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a href="mailto:info@architectgood.com" className="text-primary hover:text-primary-dark transition-colors duration-300 text-xl font-medium">
              info@architectgood.com
            </a>
            <p className="text-gray-600 text-lg">123 Design Street, Innovation City, Techland</p>
            <p className="text-gray-600 text-lg">+1 (555) 123-4567</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-neutral-100 text-center">
        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary">
          Ready to Transform Your Workflow?
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