import BidCard from './BidCard';
import BidSkeletonLoader from '../common/BidSkeletonLoader';
import ErrorMessage from '../common/ErrorMessage';

export default function BidList({ bids, isLoading, error, gigOwnerId, gigStatus, gigId, onHireSuccess, onHireError, updateGigStatus }) {
  if (isLoading) {
    return <BidSkeletonLoader count={3} />;
  }

  if (error) {
    return <ErrorMessage message={error} className="mb-4" />;
  }

  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-black text-lg">No bids yet for this gig.</p>
      </div>
    );
  }

  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-4">
      {sortedBids.map((bid) => (
        <BidCard 
          key={bid._id} 
          bid={bid} 
          gigOwnerId={gigOwnerId} 
          gigStatus={gigStatus}
          gigId={gigId}
          onHireSuccess={onHireSuccess}
          onHireError={onHireError}
          updateGigStatus={updateGigStatus}
        />
      ))}
    </div>
  );
}
