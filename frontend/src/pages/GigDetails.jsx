import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useGigStore from '../store/gigStore';
import useAuthStore from '../store/authStore';
import useBidStore from '../store/bidStore';
import Button from '../components/common/Button';
import BidForm from '../components/bid/BidForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBidForm, setShowBidForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { gigs, fetchGigById, fetchGigs } = useGigStore();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchBidsByGig, bids, isLoading: bidsLoading } = useBidStore();
  
  const gig = gigs.find((g) => g._id === id);
  const isOwner = gig && (user?._id === gig.ownerId?._id || user?._id === gig.ownerId);
  const isOpen = gig?.status === 'open';

  useEffect(() => {
    if (!gig) {
      fetchGigById(id);
    }
  }, [id, gig, fetchGigById]);

  useEffect(() => {
    if (gig && isOwner) {
      fetchBidsByGig(id);
    }
  }, [id, gig, isOwner, fetchBidsByGig]);

  if (!gig) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-black p-4 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">{gig.title}</h1>
          <span
            className={`px-4 py-2 border border-black text-sm font-medium ${
              gig.status === 'open'
                ? 'bg-white text-black'
                : gig.status === 'assigned'
                ? 'bg-black text-white'
                : 'bg-black text-white'
            }`}
          >
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-black whitespace-pre-wrap">{gig.description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-sm text-black">Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-black">${gig.budget}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-black">Posted by</p>
            <p className="text-sm font-medium text-black">{gig.ownerId?.name || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {isOwner && (
            <Link to={`/gigs/${id}/bids`}>
              <Button variant="primary">View Bids ({bids.length})</Button>
            </Link>
          )}
          {isAuthenticated && !isOwner && isOpen && (
            <Button
              variant="primary"
              onClick={() => setShowBidForm(!showBidForm)}
            >
              {showBidForm ? 'Cancel' : 'Apply for this Gig'}
            </Button>
          )}
        </div>
      </div>
      
      <SuccessMessage message={successMessage} className="mb-4" />
      
      {showBidForm && !isOwner && isOpen && (
        <div className="mb-6">
          <BidForm
            gigId={id}
            onSuccess={() => {
              setShowBidForm(false);
              setSuccessMessage('Bid submitted successfully!');
              fetchGigs();
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
            onCancel={() => setShowBidForm(false)}
          />
        </div>
      )}
    </div>
  );
}
