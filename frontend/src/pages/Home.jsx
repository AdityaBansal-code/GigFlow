import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGigStore from '../store/gigStore';
import useAuthStore from '../store/authStore';
import GigList from '../components/gig/GigList';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import { useDebounce } from '../hooks/useDebounce';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { gigs, isLoading, error, fetchGigs } = useGigStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchGigs(debouncedSearch);
  }, [debouncedSearch, fetchGigs]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">Browse Gigs</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search gigs by title..."
              onClear={handleClearSearch}
            />
          </div>
          {isAuthenticated && (
            <Link to="/gigs/new">
              <Button variant="primary">Post a Gig</Button>
            </Link>
          )}
        </div>
      </div>
      
      <GigList gigs={gigs} isLoading={isLoading} error={error} searchQuery={searchQuery} />
    </div>
  );
}
