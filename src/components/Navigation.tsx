
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveLink(sectionId);
        }
      });
      
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', link: 'home' },
    { name: 'About', link: 'about' },
    { name: 'Services', link: 'services' },
    { name: 'Skills', link: 'skills' },
    { name: 'Portfolio', link: 'portfolio' },
    { name: 'Experience', link: 'experience' },
    { name: 'Testimonials', link: 'testimonials' },
    { name: 'Contact', link: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    setActiveLink(id);
    
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-portfolio-darkest/90 backdrop-blur-md shadow-md' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-heading font-bold text-white">
          Portfolio<span className="text-portfolio-blue">.</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.link}
              onClick={() => handleNavClick(link.link)}
              className={`nav-link ${activeLink === link.link ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
          <Link to="/admin" className="btn-primary py-2">
            Admin
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-portfolio-darkest border-t border-portfolio-dark animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.link}
                onClick={() => handleNavClick(link.link)}
                className={`nav-link ${activeLink === link.link ? 'active' : ''}`}
              >
                {link.name}
              </button>
            ))}
            <Link to="/admin" className="btn-primary">
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
