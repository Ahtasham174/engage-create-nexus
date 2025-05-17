
import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };
  
  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "contact@johndoe.com",
      link: "mailto:contact@johndoe.com"
    },
    {
      icon: <Phone size={24} />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <MapPin size={24} />,
      title: "Location",
      content: "San Francisco, CA",
      link: "https://maps.google.com/?q=San+Francisco,+CA"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-portfolio-dark tech-pattern">
      <div className="section-container">
        <h2 className="section-title">Contact Me</h2>
        <p className="section-description">
          Have a project in mind? Let's discuss how I can help bring your ideas to life.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-portfolio-darkest rounded-2xl p-8 border border-portfolio-dark/40">
              <h3 className="text-2xl font-heading font-medium text-white mb-6">Send Me a Message</h3>
              
              {submitSuccess ? (
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-green-400">
                  <p className="font-medium">Thank you for your message!</p>
                  <p>I'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-portfolio-gray mb-2 text-sm">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-portfolio-dark border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-portfolio-gray mb-2 text-sm">Your Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-portfolio-dark border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-portfolio-gray mb-2 text-sm">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-portfolio-dark border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white"
                      placeholder="Project Discussion"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-portfolio-gray mb-2 text-sm">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-portfolio-dark border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                      <p>{submitError}</p>
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className={`btn-primary w-full ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message <ArrowRight size={18} className="ml-2" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact information */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-portfolio-darkest rounded-xl p-6 border border-portfolio-dark/40 hover:border-portfolio-blue/40 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-portfolio-navy/30 flex items-center justify-center text-portfolio-blue mr-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-lg">{item.title}</h3>
                      <a 
                        href={item.link}
                        className="text-portfolio-gray hover:text-portfolio-blue transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {item.content}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-portfolio-darkest rounded-xl p-6 border border-portfolio-dark/40">
                <h3 className="text-white font-medium text-lg mb-4">Follow Me</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-portfolio-navy/30 flex items-center justify-center text-portfolio-gray hover:text-portfolio-blue hover:bg-portfolio-navy/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-portfolio-navy/30 flex items-center justify-center text-portfolio-gray hover:text-portfolio-blue hover:bg-portfolio-navy/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-portfolio-navy/30 flex items-center justify-center text-portfolio-gray hover:text-portfolio-blue hover:bg-portfolio-navy/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-portfolio-navy/30 flex items-center justify-center text-portfolio-gray hover:text-portfolio-blue hover:bg-portfolio-navy/50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-portfolio-navy to-portfolio-blue rounded-xl p-6 text-white">
                <h3 className="font-heading font-medium text-xl mb-2">Let's Work Together</h3>
                <p className="text-white/80 mb-4">
                  Have an exciting project where you need some help?
                  Send me a message or contact me via email or phone.
                </p>
                <a href="mailto:contact@johndoe.com" className="inline-flex items-center text-white hover:underline">
                  Get in touch <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
