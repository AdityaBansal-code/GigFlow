import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useGigStore from '../store/gigStore';
import useAuthStore from '../store/authStore';
import useBidStore from '../store/bidStore';
import BidList from '../components/bid/BidList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import Button from '../components/common/Button';

export default function ViewBids() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { gigs, fetchGigById, updateGigStatus } = useGigStore();
  const { user } = useAuthStore();
  const { bids, isLoading, error, fetchBidsByGig, clearError } = useBidStore();
  
  const gig = gigs.find((g) => g._id === id);
  const isOwner = gig && (user?._id === gig.ownerId?._id || user?._id === gig.ownerId);

  useEffect(() => {
    if (!gig) {
      fetchGigById(id);
    }
  }, [id, gig, fetchGigById]);

  useEffect(() => {
    if (gig && id) {
      fetchBidsByGig(id);
    }
  }, [id, gig, fetchBidsByGig]);

  useEffect(() => {
    if (gig && !isOwner) {
      navigate('/');
    }
  }, [gig, isOwner, navigate]);

  if (!gig) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/gigs/${id}`}>
          <Button variant="secondary" size="small" className="mb-4">
            ← Back to Gig Details
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-black mb-2">Bids for: {gig.title}</h1>
        <p className="text-black">Review and hire freelancers for your gig</p>
      </div>
      
      <ErrorMessage message={error} className="mb-4" />
      <SuccessMessage message={successMessage} className="mb-4" />
      
      <BidList
        bids={bids}
        isLoading={isLoading}
        error={error}
        gigOwnerId={gig.ownerId?._id || gig.ownerId}
        gigStatus={gig.status}
        gigId={id}
        onHireSuccess={() => {
          setSuccessMessage('Freelancer hired successfully! Gig status updated to assigned.');
          clearError();
          fetchGigById(id);
          setTimeout(() => setSuccessMessage(''), 5000);
        }}
        onHireError={(errorMessage) => {
          setSuccessMessage('');
        }}
        updateGigStatus={updateGigStatus}
      />
    </div>
  );
}
