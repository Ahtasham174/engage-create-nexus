
import { useState } from 'react';

const Experience = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const experiences = [
    {
      company: "TechAI Solutions",
      role: "Senior Data Scientist",
      period: "2020 - Present",
      description: "Leading a team of data scientists in developing machine learning solutions for enterprise clients. Responsible for project management, client communication, and technical delivery.",
      achievements: [
        "Spearheaded the development of a predictive maintenance solution that reduced manufacturing downtime by 35% for a Fortune 500 client",
        "Implemented a customer segmentation model that improved marketing campaign ROI by 28%",
        "Mentored junior data scientists and established best practices for model development and deployment"
      ],
      technologies: ["PyTorch", "TensorFlow", "AWS", "Docker", "Kubernetes"]
    },
    {
      company: "DataViz Corp",
      role: "Machine Learning Engineer",
      period: "2018 - 2020",
      description: "Designed and implemented machine learning models for various business applications, with a focus on natural language processing and recommendation systems.",
      achievements: [
        "Built an NLP pipeline for sentiment analysis that processes over 50,000 customer reviews daily",
        "Developed a recommendation engine that increased e-commerce conversion rates by 18%",
        "Optimized model deployment process, reducing inference time by 40%"
      ],
      technologies: ["Python", "Scikit-Learn", "Spark", "Kafka", "MongoDB"]
    },
    {
      company: "InnovateAI",
      role: "Data Analyst",
      period: "2016 - 2018",
      description: "Conducted data analysis and created visualizations to support business decisions. Developed initial machine learning prototypes for proof-of-concept projects.",
      achievements: [
        "Created interactive dashboards that provided real-time insights into business KPIs",
        "Automated reporting processes, saving the team 15 hours per week",
        "Conducted A/B tests that led to a 12% increase in user engagement"
      ],
      technologies: ["Python", "SQL", "Tableau", "Power BI", "R"]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-portfolio-dark tech-pattern">
      <div className="section-container">
        <h2 className="section-title">My Experience</h2>
        <p className="section-description">
          I have worked with leading companies in the tech industry, delivering data-driven solutions.
        </p>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company tabs */}
          <div className="lg:col-span-3">
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
              {experiences.map((exp, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`min-w-[200px] text-left p-4 border-b-2 lg:border-b-0 lg:border-l-2 transition-all ${
                    activeTab === index 
                      ? 'text-portfolio-blue border-portfolio-blue bg-portfolio-navy/20' 
                      : 'text-portfolio-gray border-portfolio-dark hover:bg-portfolio-navy/10 hover:text-white'
                  }`}
                >
                  <p className="font-medium text-lg">{exp.company}</p>
                  <p className="text-sm opacity-75">{exp.period}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Experience details */}
          <div className="lg:col-span-9">
            <div className="p-6 bg-gradient-to-br from-portfolio-dark/80 to-portfolio-darkest rounded-lg border border-portfolio-dark/60">
              <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-2xl text-white font-medium">{experiences[activeTab].role}</h3>
                    <p className="text-portfolio-blue">{experiences[activeTab].company}</p>
                  </div>
                  <span className="px-4 py-1 bg-portfolio-navy/30 text-portfolio-gray rounded-full text-sm">
                    {experiences[activeTab].period}
                  </span>
                </div>
                
                <p className="text-portfolio-gray mb-6">{experiences[activeTab].description}</p>
                
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3">Key Achievements:</h4>
                  <ul className="space-y-3">
                    {experiences[activeTab].achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-portfolio-blue mr-2 mt-1">•</span>
                        <span className="text-portfolio-gray">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {experiences[activeTab].technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-sm rounded-full bg-portfolio-navy/40 text-portfolio-gray"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <a 
                href="#" 
                download 
                className="btn-outline"
              >
                Download Full Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
