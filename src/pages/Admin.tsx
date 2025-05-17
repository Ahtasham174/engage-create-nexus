
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setHasError(true);
          return;
        }
        
        if (data.session) {
          localStorage.setItem('adminLoggedIn', 'true');
          navigate('/admin/dashboard');
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-portfolio-darkest flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-portfolio-blue mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="min-h-screen bg-portfolio-darkest flex items-center justify-center p-4">
        <div className="bg-portfolio-dark border border-red-500 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Connection Error</h2>
          <p className="text-portfolio-gray mb-6">
            Unable to connect to authentication service. Please check your Supabase configuration and try again.
          </p>
          <p className="text-sm text-portfolio-gray">
            Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set properly.
          </p>
        </div>
      </div>
    );
  }
  
  return <AdminLogin />;
};

export default Admin;
