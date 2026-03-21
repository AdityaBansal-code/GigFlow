import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ClientSection from '../components/dashboard/ClientSection';
import FreelancerSection from '../components/dashboard/FreelancerSection';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, dashboard, fetchDashboard, isLoading, error } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        await fetchDashboard();
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, navigate, fetchDashboard]);

  if (loading || isLoading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Manage your gigs and bids in one place</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {dashboard && (
        <div className="dashboard-content">
          {/* Stats Overview */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{dashboard.stats.postedGigsCount}</div>
              <div className="stat-label">Gigs Posted</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dashboard.stats.submittedBidsCount}</div>
              <div className="stat-label">Bids Submitted</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dashboard.stats.hiredFreelancersCount}</div>
              <div className="stat-label">Freelancers Hired</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dashboard.stats.hiredProjectsCount}</div>
              <div className="stat-label">Projects Won</div>
            </div>
            {dashboard.stats.avgRating > 0 && (
              <div className="stat-card">
                <div className="stat-value">
                  ⭐ {dashboard.stats.avgRating.toFixed(1)}
                </div>
                <div className="stat-label">
                  ({dashboard.stats.totalReviews} reviews)
                </div>
              </div>
            )}
          </div>

          {/* Client Section */}
          <ClientSection data={dashboard.asClient} />

          {/* Freelancer Section */}
          <FreelancerSection data={dashboard.asFreelancer} />
        </div>
      )}
    </div>
  );
}
