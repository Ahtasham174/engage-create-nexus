
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          localStorage.removeItem('adminLoggedIn');
          navigate('/admin');
        } else {
          localStorage.setItem('adminLoggedIn', 'true');
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('adminLoggedIn');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('adminLoggedIn');
        navigate('/admin');
      }
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-portfolio-darkest flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-portfolio-blue mb-4" />
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-darkest flex flex-col md:flex-row">
      <AdminSidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
