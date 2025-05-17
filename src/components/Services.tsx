
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  
  const services = [
    {
      id: 1,
      title: "Data Analysis & Visualization",
      description: "Transform your raw data into actionable insights with comprehensive analysis and intuitive visualizations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      details: [
        "Exploratory data analysis",
        "Interactive dashboards",
        "Statistical modeling",
        "Business intelligence reporting",
        "Data quality assessment"
      ]
    },
    {
      id: 2,
      title: "Machine Learning Solutions",
      description: "Custom machine learning models designed to solve your specific business problems and drive growth.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        "Predictive analytics",
        "Classification and regression models",
        "Clustering and pattern recognition",
        "Time series forecasting",
        "Model deployment and monitoring"
      ]
    },
    {
      id: 3,
      title: "Natural Language Processing",
      description: "Leverage text data with advanced NLP techniques to extract insights, automate processes, and enhance customer experiences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      details: [
        "Sentiment analysis",
        "Entity recognition",
        "Text classification",
        "Topic modeling",
        "Chatbot development"
      ]
    },
    {
      id: 4,
      title: "AI Strategy Consulting",
      description: "Develop a comprehensive AI roadmap to integrate artificial intelligence into your business operations.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      details: [
        "AI readiness assessment",
        "Technology selection",
        "Implementation planning",
        "ROI analysis",
        "AI ethics and governance"
      ]
    },
    {
      id: 5,
      title: "Computer Vision Systems",
      description: "Build systems that can analyze and interpret visual information from the world, automating visual inspection and recognition tasks.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        "Object detection and recognition",
        "Image classification",
        "Facial recognition",
        "Motion analysis",
        "OCR and document processing"
      ]
    },
    {
      id: 6,
      title: "Deep Learning Implementation",
      description: "Cutting-edge neural network architectures designed to solve complex pattern recognition problems with high accuracy.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      details: [
        "Neural network design",
        "Transfer learning",
        "Reinforcement learning",
        "GANs for synthetic data",
        "Model optimization"
      ]
    }
  ];

  const handleServiceHover = (id: number | null) => {
    setHoveredService(id);
  };

  return (
    <section id="services" className="py-24 bg-portfolio-darkest">
      <div className="section-container">
        <h2 className="section-title">My Services</h2>
        <p className="section-description">
          I offer a wide range of data science and AI services tailored to meet your business needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service) => (
            <div 
              key={service.id}
              className="tech-card relative group transition-all duration-300 overflow-hidden"
              onMouseEnter={() => handleServiceHover(service.id)}
              onMouseLeave={() => handleServiceHover(null)}
            >
              <div className={`transition-all duration-500 ${
                hoveredService === service.id ? 'opacity-0' : 'opacity-100'
              }`}>
                <div className="text-portfolio-blue mb-6">{service.icon}</div>
                <h3 className="text-xl font-heading font-medium text-white mb-4">{service.title}</h3>
                <p className="text-portfolio-gray">{service.description}</p>
              </div>
              
              <div className={`absolute inset-0 bg-portfolio-dark p-6 transition-all duration-500 ${
                hoveredService === service.id 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
              }`}>
                <h3 className="text-xl font-heading font-medium text-white mb-4">{service.title}</h3>
                <ul className="space-y-2 mb-6">
                  {service.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-portfolio-blue mr-2">•</span>
                      <span className="text-portfolio-gray">{detail}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="flex items-center text-portfolio-blue hover:text-white transition-colors">
                  Request this service <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#contact" className="btn-primary">
            Discuss Your Project <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
