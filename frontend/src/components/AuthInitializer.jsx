import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigationCallback } from '../utils/apiClient';

export default function AuthInitializer() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback((path) => navigate(path));
  }, [navigate]);

  return null;
}
