import { useState } from 'react';
import Button from '../common/Button';
import useReviewStore from '../../store/reviewStore';

export default function ReviewForm({ gigId, bidId, onSuccess }) {
  const { submitReview, isLoading } = useReviewStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await submitReview({ gigId, bidId, rating, comment });
      if (onSuccess) {
        onSuccess();
      }
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-black p-3 mt-3 space-y-3">
      <div>
        <label className="block text-sm mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-black px-2 py-1 w-full"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Very Poor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border border-black px-2 py-1 w-full"
          rows={3}
          maxLength={1000}
          placeholder="Share feedback about this freelancer"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="primary" size="small" isLoading={isLoading}>
        Submit Review
      </Button>
    </form>
  );
}
