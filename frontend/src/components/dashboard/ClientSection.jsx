import { useState } from 'react';
import { Link } from 'react-router-dom';
import GigCard from '../gig/GigCard';
import ReviewForm from '../review/ReviewForm';

export default function ClientSection({ data }) {
  const [activeReviewBidId, setActiveReviewBidId] = useState(null);

  if (!data || (!data.postedGigs?.length && !data.receivedBids?.length)) {
    return (
      <section className="dashboard-section">
        <h2>Client Hub</h2>
        <div className="empty-state">
          <p>No gigs posted yet. Start by creating your first gig!</p>
          <Link to="/gigs/new" className="btn btn-primary">
            Create a Gig
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2>Client Hub</h2>

      {data.postedGigs?.length > 0 && (
        <div className="subsection">
          <h3>Your Posted Gigs ({data.postedGigs.length})</h3>
          <div className="gigs-grid">
            {data.postedGigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        </div>
      )}

      {data.receivedBids?.length > 0 && (
        <div className="subsection">
          <h3>Bids Received ({data.receivedBids.length})</h3>
          <div className="bids-list">
            {data.receivedBids.map((bid) => (
              <div key={bid._id} className="bid-item">
                <div className="bid-header">
                  <h4>{bid.gigId.title}</h4>
                  <span className={`bid-status ${bid.status}`}>{bid.status}</span>
                </div>
                <p className="bid-freelancer">
                  From: <strong>{bid.freelancerId.name}</strong>
                </p>
                <p className="bid-price">${bid.price}</p>
                <p className="bid-message">{bid.message}</p>
                {bid.status === 'pending' && (
                  <Link to={`/gigs/${bid.gigId._id}/bids`} className="btn btn-small btn-primary">
                    View and Hire
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.hiredFreelancers?.length > 0 && (
        <div className="subsection">
          <h3>Hired Freelancers ({data.hiredFreelancers.length})</h3>
          <div className="freelancers-list">
            {data.hiredFreelancers.map((bid) => (
              <div key={bid._id} className="freelancer-item">
                <div className="freelancer-info">
                  <h4>{bid.freelancerId.name}</h4>
                  <p className="gig-title">on: {bid.gigId.title}</p>
                  <p className="freelancer-rating">{`Rating: ${bid.freelancerId.avgRating || 'New'}`}</p>
                </div>
                <div className="freelancer-price">${bid.price}</div>
                <Link to={`/profile/${bid.freelancerId._id}`} className="btn btn-small btn-secondary">
                  View Profile
                </Link>
                <button
                  className="btn btn-small btn-primary"
                  type="button"
                  onClick={() => setActiveReviewBidId((prev) => (prev === bid._id ? null : bid._id))}
                >
                  {activeReviewBidId === bid._id ? 'Cancel Review' : 'Leave Review'}
                </button>
                {activeReviewBidId === bid._id && (
                  <ReviewForm
                    gigId={bid.gigId._id}
                    bidId={bid._id}
                    onSuccess={() => setActiveReviewBidId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/gigs/new" className="btn btn-primary mt-3">
        Post New Gig
      </Link>
    </section>
  );
}
