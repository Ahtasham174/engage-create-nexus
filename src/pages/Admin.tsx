
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  return <AdminLogin />;
};

export default Admin;
