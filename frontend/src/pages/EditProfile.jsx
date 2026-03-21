import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useProfileStore from '../store/profileStore';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import './EditProfile.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { updateMyProfile, isLoading } = useProfileStore();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    profilePhoto: '',
    portfolio: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile/${user._id}`,
        );
        const data = await response.json();

        if (data.data) {
          setFormData({
            bio: data.data.bio || '',
            skills: data.data.skills ? data.data.skills.join(', ') : '',
            profilePhoto: data.data.profilePhoto || '',
            portfolio: data.data.portfolio || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, user._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        bio: formData.bio,
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        profilePhoto: formData.profilePhoto || null,
        portfolio: formData.portfolio || null,
      };

      await updateMyProfile(payload);

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate(`/profile/${user._id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Your Profile</h1>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself (max 500 characters)"
            maxLength="500"
            rows="4"
          />

          <Input
            label="Skills (comma-separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, Design, Writing"
          />

          <Input
            label="Profile Photo URL"
            name="profilePhoto"
            type="url"
            value={formData.profilePhoto}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />

          <Input
            label="Portfolio URL"
            name="portfolio"
            type="url"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://myportfolio.com"
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
