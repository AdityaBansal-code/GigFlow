import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from '../common/Button';
import { highlightText } from '../../utils/highlightText';

export default function GigCard({ gig, searchQuery = '' }) {
  const { user } = useAuthStore();
  const isOwner = user?._id === gig.ownerId?._id || user?._id === gig.ownerId;
  const isOpen = gig.status === 'open';

  return (
    <div className="bg-white border border-black p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-black">
          {searchQuery ? highlightText(gig.title, searchQuery) : gig.title}
        </h3>
        <span
          className={`px-3 py-1 border border-black text-sm font-medium ${
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
      
      <p className="text-black mb-4 line-clamp-2">{gig.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-black">Budget</p>
          <p className="text-lg font-bold text-black">${gig.budget}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-black">Posted by</p>
          <p className="text-sm font-medium text-black">{gig.ownerId?.name || 'Unknown'}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link to={`/gigs/${gig._id}`} className="flex-1">
          <Button variant="secondary" size="small" className="w-full">
            View Details
          </Button>
        </Link>
        {isOpen && !isOwner && (
          <Link to={`/gigs/${gig._id}`} className="flex-1">
            <Button variant="primary" size="small" className="w-full">
              Apply
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
