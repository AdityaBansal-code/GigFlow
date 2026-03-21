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
  const [showEditForm, setShowEditForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    difficulty: '',
    deadline: '',
  });
  
  const { gigs, fetchGigById, fetchGigs, editGig, removeGig, isLoading, error } = useGigStore();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchBidsByGig, bids } = useBidStore();
  
  const gig = gigs.find((g) => g._id === id);
  const isOwner = gig && (user?._id === gig.ownerId?._id || user?._id === gig.ownerId);
  const isOpen = gig?.status === 'open';
  const statusClasses = gig?.status === 'open' ? 'bg-white text-black' : 'bg-black text-white';

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

  const openEditForm = () => {
    if (!gig) {
      return;
    }
    setEditData({
      title: gig.title || '',
      description: gig.description || '',
      budget: gig.budget || '',
      category: gig.category || '',
      difficulty: gig.difficulty || '',
      deadline: gig.deadline ? new Date(gig.deadline).toISOString().slice(0, 10) : '',
    });
    setShowEditForm((prev) => !prev);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await editGig(id, {
      title: editData.title,
      description: editData.description,
      budget: Number(editData.budget),
      category: editData.category || undefined,
      difficulty: editData.difficulty || undefined,
      deadline: editData.deadline || null,
    });
    setShowEditForm(false);
    setSuccessMessage('Gig updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = async () => {
    const confirmed = globalThis.confirm('Are you sure you want to delete this gig?');
    if (!confirmed) {
      return;
    }
    await removeGig(id);
    navigate('/gigs');
  };

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
            className={`px-4 py-2 border border-black text-sm font-medium ${statusClasses}`}
          >
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-black whitespace-pre-wrap">{gig.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {gig.category && <span className="px-2 py-1 text-xs border border-black">{gig.category}</span>}
          {gig.difficulty && <span className="px-2 py-1 text-xs border border-black">{gig.difficulty}</span>}
          {gig.deadline && (
            <span className="px-2 py-1 text-xs border border-black">
              Deadline: {new Date(gig.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-sm text-black">Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-black">${gig.budget}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-black">Posted by</p>
            <p className="text-sm font-medium text-black">{gig.ownerId?.name || 'Unknown'}</p>
            {gig.ownerId?._id && (
              <Link to={`/profile/${gig.ownerId._id}`} className="text-xs underline text-black">
                View profile
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {isOwner && (
            <Link to={`/gigs/${id}/bids`}>
              <Button variant="primary">View Bids ({bids.length})</Button>
            </Link>
          )}
          {isOwner && isOpen && (
            <Button variant="secondary" onClick={openEditForm}>
              {showEditForm ? 'Cancel Edit' : 'Edit Gig'}
            </Button>
          )}
          {isOwner && isOpen && (
            <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
              Delete Gig
            </Button>
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

      {error && <ErrorMessage message={error} className="mb-4" />}
      
      <SuccessMessage message={successMessage} className="mb-4" />

      {showEditForm && isOwner && isOpen && (
        <form onSubmit={handleEditSubmit} className="bg-white border border-black p-4 sm:p-6 mb-6 space-y-3">
          <input
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="w-full border border-black px-3 py-2"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="w-full border border-black px-3 py-2"
            rows={4}
            placeholder="Description"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              name="budget"
              value={editData.budget}
              onChange={handleEditChange}
              className="border border-black px-3 py-2"
              type="number"
              min="0"
              placeholder="Budget"
            />
            <select
              name="category"
              value={editData.category}
              onChange={handleEditChange}
              className="border border-black px-3 py-2"
            >
              <option value="">Category</option>
              <option value="Web Dev">Web Dev</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Data">Data</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="difficulty"
              value={editData.difficulty}
              onChange={handleEditChange}
              className="border border-black px-3 py-2"
            >
              <option value="">Difficulty</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <input
            name="deadline"
            value={editData.deadline}
            onChange={handleEditChange}
            className="border border-black px-3 py-2"
            type="date"
          />
          <Button type="submit" variant="primary" isLoading={isLoading}>Save Changes</Button>
        </form>
      )}
      
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
