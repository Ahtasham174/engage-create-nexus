
import { useState, useEffect, useRef } from 'react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const testimonials = [
    {
      id: 1,
      content: "John's expertise in machine learning helped us implement a customer segmentation model that increased our marketing ROI by 30%. His ability to translate complex technical concepts into business value is outstanding.",
      author: "Sarah Johnson",
      position: "CMO, E-commerce Corp",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: 2,
      content: "Working with John was a game-changer for our startup. His predictive analytics solution helped us identify market opportunities we would have otherwise missed. He delivers high-quality work on time and is a great communicator.",
      author: "Michael Chen",
      position: "CEO, TechStartup Inc",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      content: "We hired John to develop a sentiment analysis system for our customer support team. The solution exceeded our expectations and is now a critical part of our operations. Highly recommended for NLP projects!",
      author: "Anna Martinez",
      position: "Customer Experience Director, ServiceFirst",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      content: "John's computer vision solution for our quality control process reduced defect rates by 40%. His technical skills are matched by his project management abilities and attention to detail.",
      author: "David Wilson",
      position: "Operations Manager, Manufacturing Inc",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg"
    }
  ];
  
  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length]);
  
  // Reset interval when manually changing testimonial
  const handleTestimonialChange = (index: number) => {
    setCurrentTestimonial(index);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
  };

  return (
    <section id="testimonials" className="py-24 bg-portfolio-darkest">
      <div className="section-container">
        <h2 className="section-title">Testimonials</h2>
        <p className="section-description">
          Hear what my clients have to say about working with me.
        </p>
        
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Testimonial display */}
          <div className="grid grid-cols-1 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-card transition-all duration-500 ${
                  currentTestimonial === index 
                    ? 'opacity-100 scale-100 block' 
                    : 'opacity-0 scale-95 hidden'
                }`}
              >
                <div className="bg-portfolio-dark border border-portfolio-dark/70 rounded-2xl p-8 relative">
                  {/* Quote icon */}
                  <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-portfolio-blue flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                      />
                    </svg>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-portfolio-gray italic text-lg mb-6">"{testimonial.content}"</p>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{testimonial.author}</h4>
                        <p className="text-portfolio-blue text-sm">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index 
                    ? 'bg-portfolio-blue w-6' 
                    : 'bg-portfolio-gray/40 hover:bg-portfolio-gray'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="hidden sm:block">
            <button 
              className="absolute top-1/2 -left-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-portfolio-dark border border-portfolio-dark/70 flex items-center justify-center text-portfolio-gray hover:text-white hover:bg-portfolio-navy/50 transition-colors"
              onClick={() => handleTestimonialChange((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute top-1/2 -right-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-portfolio-dark border border-portfolio-dark/70 flex items-center justify-center text-portfolio-gray hover:text-white hover:bg-portfolio-navy/50 transition-colors"
              onClick={() => handleTestimonialChange((currentTestimonial + 1) % testimonials.length)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
