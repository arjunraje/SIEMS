import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate('/');
    };

    performLogout();
  }, [logout, navigate]);

  return <p className="text-center mt-10">Logging out...</p>;
};

export default LogoutHandler;
