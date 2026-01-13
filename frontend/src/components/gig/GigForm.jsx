import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGigStore from '../../store/gigStore';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

export default function GigForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { createGig, isLoading } = useGigStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!title || !description || !budget) {
      setError('All fields are required');
      return;
    }
    
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError('Budget must be a positive number');
      return;
    }
    
    try {
      await createGig(title, description, budgetNum);
      setSuccess('Gig created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/gigs');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-black p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-black">Create New Gig</h2>
      
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} className="mb-4" />
        <SuccessMessage message={success} className="mb-4" />
        
        <Input
          label="Title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter gig title"
        />
        
        <Textarea
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe your gig requirements"
          rows={6}
        />
        
        <Input
          label="Budget"
          type="number"
          name="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          placeholder="Enter budget amount"
          min="0"
          step="0.01"
        />
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/gigs')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
          >
            Create Gig
          </Button>
        </div>
      </form>
    </div>
  );
}
