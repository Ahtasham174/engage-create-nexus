
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import { supabase } from '@/lib/supabase';

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  return <AdminLogin />;
};

export default Admin;
