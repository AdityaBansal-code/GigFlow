import { Link } from 'react-router-dom';
import useBidStore from '../../store/bidStore';

export default function FreelancerSection({ data }) {
  const { withdrawBid, isLoading } = useBidStore();

  const handleWithdraw = async (bidId) => {
    try {
      await withdrawBid(bidId);
    } catch {
      // Store error is handled by parent pages.
    }
  };

  if (!data || (!data.submittedBids?.length && !data.hiredProjects?.length)) {
    return (
      <section className="dashboard-section">
        <h2>💼 Freelancer Hub</h2>
        <div className="empty-state">
          <p>No bids submitted yet. Browse and bid on gigs to get started!</p>
          <Link to="/gigs" className="btn btn-primary">
            Browse Gigs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <h2>💼 Freelancer Hub</h2>

      {/* Submitted Bids */}
      {data.submittedBids?.length > 0 && (
        <div className="subsection">
          <h3>Your Submitted Bids ({data.submittedBids.length})</h3>
          <div className="bids-list">
            {data.submittedBids.map((bid) => (
              <div key={bid._id} className="bid-item submitted">
                <div className="bid-header">
                  <h4>{bid.gigId.title}</h4>
                  <span className={`bid-status ${bid.status}`}>{bid.status}</span>
                </div>
                <p className="bid-client">
                  Client: <strong>{bid.gigId.ownerId.name}</strong>
                </p>
                <p className="bid-budget">Gig Budget: ${bid.gigId.budget}</p>
                <p className="bid-your-price">Your Bid: <strong>${bid.price}</strong></p>
                <p className="bid-message">{bid.message}</p>
                <div className="bid-actions">
                  <Link
                    to={`/gigs/${bid.gigId._id}`}
                    className="btn btn-small btn-secondary"
                  >
                    View Gig
                  </Link>
                  {bid.status === 'pending' && (
                    <button
                      className="btn btn-small btn-danger"
                      type="button"
                      onClick={() => handleWithdraw(bid._id)}
                      disabled={isLoading}
                    >
                      Withdraw Bid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hired Projects */}
      {data.hiredProjects?.length > 0 && (
        <div className="subsection">
          <h3>🎉 Hired Projects ({data.hiredProjects.length})</h3>
          <div className="projects-list">
            {data.hiredProjects.map((bid) => (
              <div key={bid._id} className="project-item">
                <h4>{bid.gigId.title}</h4>
                <p className="project-client">
                  Client: <strong>{bid.gigId.ownerId.name}</strong>
                </p>
                <p className="project-budget">Budget: ${bid.gigId.budget}</p>
                <p className="project-your-bid">Your Agreement: ${bid.price}</p>
                <Link
                  to={`/profile/${bid.gigId.ownerId._id}`}
                  className="btn btn-small btn-primary"
                >
                  Contact Client
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Received */}
      {data.receivedReviews?.length > 0 && (
        <div className="subsection">
          <h3>⭐ Reviews ({data.receivedReviews.length})</h3>
          <div className="reviews-list">
            {data.receivedReviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <h4>{review.gigId.title}</h4>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="review-from">
                  From: <strong>{review.reviewerId.name}</strong>
                </p>
                {review.comment && (
                  <p className="review-comment">"{review.comment}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/gigs" className="btn btn-primary mt-3">
        Browse More Gigs
      </Link>
    </section>
  );
}
