export default function ReviewCard({ review }) {
  return (
    <div className="border border-black p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-black">{review.reviewerId?.name || 'Client'}</p>
          <p className="text-xs text-gray-700">{review.gigId?.title || 'Project'}</p>
        </div>
        <p className="text-sm">{'⭐'.repeat(review.rating)}</p>
      </div>
      {review.comment && <p className="text-sm text-black">{review.comment}</p>}
    </div>
  );
}
