import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from '../utils/errors.js';
import Review from '../models/Review.js';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

export const submitReview = asyncHandler(async (req, res) => {
  const { gigId, bidId, rating, comment } = req.body;
  const reviewerId = req.user._id;

  // Verify gig exists
  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  // Authorization: Only gig owner (client) can submit review
  if (gig.ownerId.toString() !== reviewerId.toString()) {
    throw new ForbiddenError('Only the gig owner can submit a review');
  }

  // Verify bid exists and is hired
  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new NotFoundError('Bid not found');
  }

  if (bid.status !== 'hired') {
    throw new BadRequestError('Can only review a bid that has been hired');
  }

  // Verify bid is for this gig
  if (bid.gigId.toString() !== gigId) {
    throw new BadRequestError('Bid does not belong to this gig');
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ gigId, bidId, reviewerId });
  if (existingReview) {
    throw new ConflictError('You have already reviewed this bid');
  }

  // Create review
  const review = await Review.create({
    gigId,
    bidId,
    reviewerId,
    revieweeId: bid.freelancerId,
    rating,
    comment: comment || '',
  });

  // Update reviewer's avgRating and totalReviews
  const allReviews = await Review.find({ revieweeId: bid.freelancerId });
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  
  await User.findByIdAndUpdate(
    bid.freelancerId,
    {
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    },
    { new: true }
  );

  await review.populate('reviewerId', 'name email profilePhoto');
  await review.populate('revieweeId', 'name email profilePhoto');

  successResponse(res, 201, review, 'Review submitted successfully');
});

export const getReviewsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const reviews = await Review.find({ revieweeId: userId })
    .populate('reviewerId', 'name email profilePhoto')
    .populate('gigId', 'title')
    .sort({ createdAt: -1 });

  successResponse(res, 200, reviews);
});

export const getReviewsForGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;

  // Verify gig exists
  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  const reviews = await Review.find({ gigId })
    .populate('reviewerId', 'name email profilePhoto')
    .populate('revieweeId', 'name email profilePhoto')
    .sort({ createdAt: -1 });

  successResponse(res, 200, reviews);
});
