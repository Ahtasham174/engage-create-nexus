
import { useState } from 'react';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  
  const tabs = [
    { id: 'story', label: 'My Story' },
    { id: 'education', label: 'Education' },
    { id: 'approach', label: 'Approach' }
  ];

  return (
    <section id="about" className="py-24 bg-portfolio-dark tech-pattern">
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <p className="section-description">
          Discover more about my background, education, and professional approach to solving complex data problems.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-portfolio-blue to-indigo-500 rounded-2xl opacity-30 blur-md"></div>
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="Working on code" 
                className="w-full h-full object-cover object-center rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-portfolio-darkest to-transparent opacity-50"></div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 p-6 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-heading font-medium text-white mb-1">John Doe</h3>
                  <p className="text-portfolio-gray">Data Scientist & AI Engineer</p>
                </div>
                <a href="#" className="btn-outline py-2">
                  Download Resume
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex border-b border-portfolio-navy/30 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === tab.id 
                      ? 'text-portfolio-blue border-b-2 border-portfolio-blue' 
                      : 'text-portfolio-gray hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="space-y-6">
              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <p className="text-lg text-portfolio-gray mb-4">
                    With over 6 years of experience in the field of data science and AI, I've 
                    developed a passion for solving complex problems using cutting-edge technology.
                  </p>
                  <p className="text-lg text-portfolio-gray mb-4">
                    My journey began as a data analyst, where I discovered the power of turning 
                    raw data into actionable insights. This led me to pursue advanced studies 
                    in machine learning and artificial intelligence.
                  </p>
                  <p className="text-lg text-portfolio-gray mb-4">
                    Today, I work with organizations to implement data-driven solutions that 
                    provide real business value. My expertise spans from predictive modeling 
                    to natural language processing and computer vision applications.
                  </p>
                  <p className="text-lg text-portfolio-gray">
                    When I'm not coding or analyzing data, you can find me contributing to 
                    open-source projects, writing technical articles, or mentoring aspiring 
                    data scientists.
                  </p>
                </div>
              )}
              
              {activeTab === 'education' && (
                <div className="animate-fade-in">
                  <div className="space-y-8">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-6">
                        <div className="w-4 h-4 rounded-full bg-portfolio-blue"></div>
                        <div className="w-0.5 bg-portfolio-blue/30 h-full"></div>
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-medium mb-1">MSc in Data Science</h3>
                        <p className="text-portfolio-blue font-medium">Stanford University</p>
                        <p className="text-sm text-portfolio-gray mt-1">2015 - 2017</p>
                        <p className="text-portfolio-gray mt-2">
                          Specialized in machine learning algorithms and big data processing, with a thesis on 
                          "Deep Learning Approaches for Natural Language Understanding."
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-6">
                        <div className="w-4 h-4 rounded-full bg-portfolio-blue"></div>
                        <div className="w-0.5 bg-portfolio-blue/30 h-full"></div>
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-medium mb-1">BSc in Computer Science</h3>
                        <p className="text-portfolio-blue font-medium">MIT</p>
                        <p className="text-sm text-portfolio-gray mt-1">2011 - 2015</p>
                        <p className="text-portfolio-gray mt-2">
                          Graduated with honors, concentrating on artificial intelligence and statistics. 
                          Active member of the AI research lab.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-6">
                        <div className="w-4 h-4 rounded-full bg-portfolio-blue"></div>
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-medium mb-1">Certifications</h3>
                        <ul className="text-portfolio-gray space-y-2 mt-2">
                          <li>• Google Professional Data Engineer</li>
                          <li>• AWS Certified Machine Learning Specialty</li>
                          <li>• Deep Learning Specialization - Coursera</li>
                          <li>• TensorFlow Developer Certificate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'approach' && (
                <div className="animate-fade-in">
                  <p className="text-lg text-portfolio-gray mb-4">
                    I believe in a pragmatic approach to data science and AI projects, focusing on 
                    business outcomes rather than just technical sophistication.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
                    <div className="tech-card">
                      <h3 className="text-xl text-white font-medium mb-2">Problem First</h3>
                      <p className="text-portfolio-gray">
                        I start by deeply understanding the problem and its business context before 
                        considering technical solutions.
                      </p>
                    </div>
                    
                    <div className="tech-card">
                      <h3 className="text-xl text-white font-medium mb-2">Data Quality</h3>
                      <p className="text-portfolio-gray">
                        Clean, relevant data is fundamental. I invest significant effort in data 
                        preprocessing and feature engineering.
                      </p>
                    </div>
                    
                    <div className="tech-card">
                      <h3 className="text-xl text-white font-medium mb-2">Iterative Development</h3>
                      <p className="text-portfolio-gray">
                        I follow an agile methodology, delivering incremental value and incorporating 
                        feedback throughout the project lifecycle.
                      </p>
                    </div>
                    
                    <div className="tech-card">
                      <h3 className="text-xl text-white font-medium mb-2">Explainable AI</h3>
                      <p className="text-portfolio-gray">
                        I prioritize creating models that are not just accurate but also transparent 
                        and interpretable for stakeholders.
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-portfolio-gray">
                    This approach has helped me deliver successful projects across diverse industries, 
                    from healthcare to finance, e-commerce to manufacturing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
