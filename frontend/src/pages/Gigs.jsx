import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useGigStore from '../store/gigStore';
import useAuthStore from '../store/authStore';
import GigList from '../components/gig/GigList';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import GigFilters from '../components/gig/GigFilters';
import { useDebounce } from '../hooks/useDebounce';

export default function Gigs() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { gigs, isLoading, error, fetchGigsFiltered } = useGigStore();
  const { isAuthenticated } = useAuthStore();
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    sortBy: '',
  });

  useEffect(() => {
    fetchGigsFiltered({
      search: debouncedSearch,
      category: filters.category,
      difficulty: filters.difficulty,
      sortBy: filters.sortBy,
    });
  }, [debouncedSearch, filters, fetchGigsFiltered]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">All Gigs</h1>
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
              <Button variant="primary">Create Gig</Button>
            </Link>
          )}
        </div>
        <GigFilters filters={filters} onChange={handleFilterChange} />
      </div>
      
      <GigList gigs={gigs} isLoading={isLoading} error={error} searchQuery={searchQuery} />
    </div>
  );
}
