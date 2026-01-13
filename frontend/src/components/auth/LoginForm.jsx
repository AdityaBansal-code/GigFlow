import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { loginUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-black p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
      
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} className="mb-4" />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          isLoading={isLoading}
          className="w-full mb-4"
        >
          Login
        </Button>
      </form>
      
      <p className="text-center text-black">
        Don't have an account?{' '}
        <Link to="/register" className="text-black border-b border-black hover:border-transparent">
          Register here
        </Link>
      </p>
    </div>
  );
}
