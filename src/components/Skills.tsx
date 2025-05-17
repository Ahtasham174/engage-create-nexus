
import { useEffect, useState, useRef } from 'react';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  const technicalSkills = [
    { name: "Python", percentage: 95 },
    { name: "Machine Learning", percentage: 90 },
    { name: "Deep Learning", percentage: 85 },
    { name: "Data Visualization", percentage: 90 },
    { name: "SQL", percentage: 85 },
    { name: "NLP", percentage: 80 },
    { name: "Computer Vision", percentage: 75 },
    { name: "Big Data (Spark)", percentage: 70 },
  ];
  
  const dataTools = [
    {
      name: "TensorFlow",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
    },
    {
      name: "PyTorch",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg"
    },
    {
      name: "Scikit-Learn",
      icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"
    },
    {
      name: "Pandas",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
    },
    {
      name: "NumPy",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
    },
    {
      name: "Tableau",
      icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg"
    },
    {
      name: "Power BI",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg"
    },
    {
      name: "AWS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg"
    },
    {
      name: "Docker",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
    },
    {
      name: "Kubernetes",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
    }
  ];
  
  const softSkills = [
    { name: "Problem Solving", level: "Expert" },
    { name: "Communication", level: "Advanced" },
    { name: "Project Management", level: "Advanced" },
    { name: "Critical Thinking", level: "Expert" },
    { name: "Team Leadership", level: "Intermediate" }
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-24 bg-portfolio-dark tech-pattern">
      <div className="section-container">
        <h2 className="section-title">My Skills</h2>
        <p className="section-description">
          My technical expertise covers a wide range of data science and AI technologies.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
          <div>
            <h3 className="text-2xl font-heading font-medium text-white mb-8">Technical Skills</h3>
            <div className="space-y-6">
              {technicalSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-portfolio-gray">{skill.percentage}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress transition-all duration-1000 ease-out"
                      style={{ 
                        width: isVisible ? `${skill.percentage}%` : '0%',
                        transition: `width 1s ease-out ${index * 0.2}s` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-heading font-medium text-white mb-8">Soft Skills</h3>
            <div className="space-y-6">
              {softSkills.map((skill, index) => (
                <div key={index} className="tech-card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-medium text-white mb-1">{skill.name}</h4>
                      <div className="flex mt-1">
                        {Array.from({ length: getLevelStars(skill.level) }).map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-portfolio-blue" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        {Array.from({ length: 5 - getLevelStars(skill.level) }).map((_, i) => (
                          <svg 
                            key={i + getLevelStars(skill.level)} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-portfolio-gray/30" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-portfolio-gray text-sm font-medium px-3 py-1 rounded-full border border-portfolio-blue/30">
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-heading font-medium text-white mb-8 text-center">Tools & Technologies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {dataTools.map((tool, index) => (
              <div 
                key={index} 
                className="tech-card flex flex-col items-center justify-center p-6 text-center hover:border-portfolio-blue/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={tool.icon} 
                  alt={tool.name} 
                  className="w-12 h-12 object-contain mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=" + tool.name.charAt(0);
                  }}
                />
                <h4 className="text-white font-medium">{tool.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to convert skill level to number of stars
function getLevelStars(level: string): number {
  switch (level) {
    case 'Novice': return 1;
    case 'Beginner': return 2;
    case 'Intermediate': return 3;
    case 'Advanced': return 4;
    case 'Expert': return 5;
    default: return 3;
  }
}

export default Skills;
