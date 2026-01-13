import { useState } from 'react';
import useBidStore from '../../store/bidStore';
import useGigStore from '../../store/gigStore';
import Textarea from '../common/Textarea';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';

export default function BidForm({ gigId, onSuccess, onCancel }) {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  
  const { createBid, isLoading } = useBidStore();
  const { fetchGigs } = useGigStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!message || !price) {
      setError('All fields are required');
      return;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      return;
    }
    
    try {
      await createBid(gigId, message, priceNum);
      setMessage('');
      setPrice('');
      fetchGigs();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white border border-black p-6">
      <h3 className="text-xl font-bold mb-4 text-black">Submit a Bid</h3>
      
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} className="mb-4" />
        
        <Textarea
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          placeholder="Describe why you're the best fit for this gig"
          rows={4}
        />
        
        <Input
          label="Your Price"
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="Enter your bid amount"
          min="0"
          step="0.01"
        />
        
        <div className="flex gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1"
          >
            Submit Bid
          </Button>
        </div>
      </form>
    </div>
  );
}
