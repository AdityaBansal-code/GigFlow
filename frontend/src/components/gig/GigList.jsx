import GigCard from './GigCard';
import LoadingSpinner from '../common/LoadingSpinner';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorMessage from '../common/ErrorMessage';

export default function GigList({ gigs, isLoading, error, searchQuery = '' }) {
  if (isLoading) {
    return <SkeletonLoader count={6} />;
  }

  if (error) {
    return <ErrorMessage message={error} className="mb-4" />;
  }

  if (!gigs || gigs.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <>
            <p className="text-black text-lg mb-2">
              No gigs found matching "{searchQuery}"
            </p>
            <p className="text-black text-sm">
              Try a different search term or browse all gigs
            </p>
          </>
        ) : (
          <p className="text-black text-lg">No gigs found. Be the first to post one!</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <GigCard key={gig._id} gig={gig} searchQuery={searchQuery} />
      ))}
    </div>
  );
}
