import useAuthStore from '../../store/authStore';
import useBidStore from '../../store/bidStore';
import Button from '../common/Button';

export default function BidCard({ bid, gigOwnerId, gigStatus = 'open', gigId, onHireSuccess, onHireError, updateGigStatus }) {
  const { user } = useAuthStore();
  const { hireFreelancer, isLoading } = useBidStore();
  const isOwner = user?._id === gigOwnerId;
  const isGigOpen = gigStatus === 'open';
  const canHire = isOwner && bid.status === 'pending' && isGigOpen;

  const handleHire = async () => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      try {
        await hireFreelancer(bid._id, gigId, updateGigStatus);
        if (onHireSuccess) {
          onHireSuccess();
        }
      } catch (error) {
        if (onHireError) {
          onHireError(error.message);
        }
      }
    }
  };

  const statusColors = {
    pending: 'bg-white text-black border-black',
    hired: 'bg-black text-white border-black',
    rejected: 'bg-white text-black border-black',
  };

  return (
    <div className="bg-white border border-black p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-black">
            {bid.freelancerId?.name || 'Unknown Freelancer'}
          </h4>
          <p className="text-sm text-black">{bid.freelancerId?.email}</p>
        </div>
        <span
          className={`px-3 py-1 border text-sm font-medium ${statusColors[bid.status] || 'bg-white text-black border-black'}`}
        >
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </span>
      </div>
      
      <p className="text-black mb-4">{bid.message}</p>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-black">Bid Amount</p>
          <p className="text-xl font-bold text-black">${bid.price}</p>
        </div>
        {canHire && (
          <Button
            variant="primary"
            size="small"
            onClick={handleHire}
            isLoading={isLoading}
          >
            Hire
          </Button>
        )}
      </div>
    </div>
  );
}
