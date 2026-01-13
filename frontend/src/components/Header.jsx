import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Button from './common/Button';

export default function Header() {
  const { user, isAuthenticated, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-xl sm:text-2xl font-bold text-black hover:text-gray-600">
            GigFlow
          </Link>
          
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
            <Link to="/gigs" className="text-sm sm:text-base text-black hover:text-gray-600 px-2 py-1 border-b border-transparent hover:border-black">
              Browse Gigs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/gigs/new" className="text-sm sm:text-base text-black hover:text-gray-600 px-2 py-1 border-b border-transparent hover:border-black">
                  Post a Gig
                </Link>
                <span className="text-sm sm:text-base text-black px-2 py-1 hidden sm:inline">
                  Hello, {user?.name}
                </span>
                <Button variant="secondary" size="small" onClick={handleLogout} className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="small" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="small" className="text-sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
