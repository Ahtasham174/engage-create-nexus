
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        if (signInError.message.includes('Invalid login')) {
          throw new Error('Invalid email or password. Please try again.');
        } else {
          throw signInError;
        }
      }
      
      if (data?.user) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-portfolio-darkest flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Admin Login<span className="text-portfolio-blue">.</span>
          </h1>
          <p className="text-portfolio-gray">
            Enter your credentials to access the admin dashboard.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-portfolio-dark rounded-xl shadow-lg p-8 border border-portfolio-dark/40">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-400">
              <div className="flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-portfolio-gray mb-2 text-sm">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-portfolio-gray text-sm">Password</label>
                <a href="#" className="text-sm text-portfolio-blue hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-portfolio-darkest border border-portfolio-dark/60 rounded-lg focus:outline-none focus:border-portfolio-blue transition-colors text-white"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-portfolio-gray text-sm">
              Create an admin account in Supabase Authentication
            </p>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-portfolio-gray hover:text-portfolio-blue transition-colors text-sm">
            &larr; Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
