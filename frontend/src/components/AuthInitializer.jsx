import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigationCallback } from '../utils/apiClient';

export default function AuthInitializer() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the navigation callback to allow apiClient to redirect using React Router
    setNavigationCallback((path) => navigate(path));
  }, [navigate]);

  return null;
}
