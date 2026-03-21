import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewCard from '../components/review/ReviewCard';
import './UserProfile.css';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { profile, reviews, isLoading, error, fetchProfile, fetchUserReviews } = useProfileStore();

  useEffect(() => {
    const loadProfile = async () => {
      await Promise.all([fetchProfile(userId), fetchUserReviews(userId)]);
    };

    if (userId) {
      loadProfile();
    }
  }, [userId, fetchProfile, fetchUserReviews]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          {profile.profilePhoto && (
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="profile-photo"
            />
          )}
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            
            {/* Rating */}
            {profile.avgRating > 0 && (
              <div className="profile-rating">
                <span className="stars">
                  {'⭐'.repeat(Math.round(profile.avgRating))}
                </span>
                <span className="rating-value">
                  {profile.avgRating.toFixed(1)} ({profile.totalReviews} reviews)
                </span>
              </div>
            )}

            {/* Edit Button */}
            {isOwnProfile && (
              <button
                onClick={() => navigate('/profile/edit')}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          {profile.bio && (
            <div className="detail-section">
              <h3>About</h3>
              <p>{profile.bio}</p>
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="detail-section">
              <h3>Skills</h3>
              <div className="skills-tags">
                {profile.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.portfolio && (
            <div className="detail-section">
              <h3>Portfolio</h3>
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                View Portfolio →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Reviews ({reviews.length})</h2>
          <div className="reviews-list">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
