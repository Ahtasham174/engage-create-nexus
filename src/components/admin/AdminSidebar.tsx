
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  BarChart3, 
  Briefcase, 
  ChevronDown, 
  FileText, 
  Home, 
  Image, 
  LayoutGrid, 
  LogOut, 
  Mail, 
  Menu, 
  MessageSquare, 
  Settings, 
  User
} from 'lucide-react';

const AdminSidebar = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    content: true,
  });
  
  const navigate = useNavigate();
  
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };
  
  const navItems = [
    { path: '/admin/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { 
      group: 'content',
      label: 'Content Management',
      icon: <LayoutGrid size={18} />,
      children: [
        { path: '/admin/profile', icon: <User size={18} />, label: 'Profile' },
        { path: '/admin/services', icon: <Briefcase size={18} />, label: 'Services' },
        { path: '/admin/portfolio', icon: <Image size={18} />, label: 'Portfolio' },
        { path: '/admin/experience', icon: <FileText size={18} />, label: 'Experience' },
        { path: '/admin/testimonials', icon: <MessageSquare size={18} />, label: 'Testimonials' },
      ]
    },
    { path: '/admin/stats', icon: <BarChart3 size={18} />, label: 'Statistics' },
    { path: '/admin/messages', icon: <Mail size={18} />, label: 'Messages' },
    { path: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-portfolio-dark border-b border-portfolio-dark/60 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="mr-4 text-portfolio-gray"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-heading font-bold text-white">
            Admin<span className="text-portfolio-blue">.</span>
          </h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-portfolio-gray hover:text-white p-2 rounded-full hover:bg-portfolio-dark/60 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
      
      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`bg-portfolio-dark border-r border-portfolio-dark/60 w-64 fixed md:static inset-y-0 left-0 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-heading font-bold text-white">
              Admin<span className="text-portfolio-blue">.</span>
            </h2>
            <button 
              className="md:hidden text-portfolio-gray" 
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center p-2 rounded-lg bg-portfolio-darkest">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">John Doe</p>
                <p className="text-portfolio-gray text-sm truncate">Administrator</p>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              if ('group' in item) {
                const isExpanded = expandedGroups[item.group];
                
                return (
                  <div key={index}>
                    <button 
                      className="w-full flex items-center justify-between p-3 rounded-lg text-portfolio-gray hover:text-white hover:bg-portfolio-darkest transition-colors"
                      onClick={() => toggleGroup(item.group)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-1 ml-4 pl-4 border-l border-portfolio-dark/60 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <NavLink
                            key={childIndex}
                            to={child.path}
                            className={({ isActive }) => `
                              flex items-center p-2 rounded-lg transition-colors
                              ${isActive 
                                ? 'bg-portfolio-blue/10 text-portfolio-blue' 
                                : 'text-portfolio-gray hover:text-white hover:bg-portfolio-darkest'
                              }
                            `}
                            onClick={() => setIsMobileSidebarOpen(false)}
                          >
                            <span className="mr-3">{child.icon}</span>
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-portfolio-blue/10 text-portfolio-blue' 
                      : 'text-portfolio-gray hover:text-white hover:bg-portfolio-darkest'
                    }
                  `}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        <div className="border-t border-portfolio-dark/60 p-4 mt-4">
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg w-full text-portfolio-gray hover:text-white hover:bg-portfolio-darkest transition-colors"
          >
            <span className="mr-3">
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
          
          <a
            href="/"
            className="flex items-center p-3 rounded-lg text-portfolio-gray hover:text-white hover:bg-portfolio-darkest transition-colors mt-2"
          >
            <span className="mr-3">
              <Home size={18} />
            </span>
            <span>Return to Site</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
