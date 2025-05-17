
import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [animateCard, setAnimateCard] = useState(false);
  
  type Project = {
    id: number;
    title: string;
    category: string;
    tags: string[];
    image: string;
    description: string;
    link?: string;
  };
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Customer Churn Prediction",
      category: "machine-learning",
      tags: ["Python", "Scikit-Learn", "Classification"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      description: "Developed a machine learning model to predict customer churn with 92% accuracy, helping the client implement targeted retention strategies."
    },
    {
      id: 2,
      title: "Sentiment Analysis Dashboard",
      category: "nlp",
      tags: ["NLP", "BERT", "React", "Flask"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Built an interactive dashboard that analyzes customer feedback sentiment in real-time, processing over 10,000 reviews daily."
    },
    {
      id: 3,
      title: "Predictive Maintenance System",
      category: "deep-learning",
      tags: ["PyTorch", "Time Series", "IoT"],
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      description: "Created a deep learning system that predicts equipment failures 2 weeks in advance, reducing downtime by 37% for a manufacturing client."
    },
    {
      id: 4,
      title: "Medical Image Classification",
      category: "computer-vision",
      tags: ["CNN", "TensorFlow", "Healthcare"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      description: "Designed a convolutional neural network for classifying medical images with 98.5% accuracy, helping radiologists prioritize critical cases."
    },
    {
      id: 5,
      title: "Recommendation Engine",
      category: "machine-learning",
      tags: ["Collaborative Filtering", "Python", "AWS"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      description: "Implemented a personalized recommendation system that increased customer engagement by 24% and average order value by 18%."
    },
    {
      id: 6,
      title: "Anomaly Detection Platform",
      category: "deep-learning",
      tags: ["Autoencoder", "Kafka", "Real-time"],
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      description: "Built an anomaly detection platform for a financial institution that identifies fraudulent transactions with 96% precision."
    }
  ];
  
  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'machine-learning', label: 'Machine Learning' },
    { key: 'deep-learning', label: 'Deep Learning' },
    { key: 'nlp', label: 'NLP' },
    { key: 'computer-vision', label: 'Computer Vision' }
  ];

  useEffect(() => {
    setAnimateCard(false);
    
    setTimeout(() => {
      const filtered = activeFilter === 'all' 
        ? projects 
        : projects.filter(project => project.category === activeFilter);
        
      setVisibleProjects(filtered);
      setAnimateCard(true);
    }, 300);
  }, [activeFilter]);

  return (
    <section id="portfolio" className="py-24 bg-portfolio-darkest">
      <div className="section-container">
        <h2 className="section-title">My Portfolio</h2>
        <p className="section-description">
          Explore a selection of my data science and AI projects across various domains and technologies.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-portfolio-blue text-white'
                  : 'bg-portfolio-dark text-portfolio-gray hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ${
          animateCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {visibleProjects.map((project) => (
            <div key={project.id} className="portfolio-item group">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-portfolio-darkest to-transparent opacity-50"></div>
                
                {/* Project tags */}
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
                  {project.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-xs rounded-full bg-black/40 backdrop-blur-sm text-white font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-portfolio-navy/90 backdrop-blur-sm flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">{project.title}</h3>
                  <p className="text-portfolio-gray mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 text-xs rounded-full bg-portfolio-blue/20 text-portfolio-blue font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-portfolio-blue hover:text-white transition-colors flex items-center">
                      View Details <ArrowRight size={16} className="ml-1" />
                    </button>
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-portfolio-blue transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Info visible outside overlay */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-white mb-1">{project.title}</h3>
                <p className="text-portfolio-blue text-sm">{project.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="btn-outline">
            View All Projects <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
