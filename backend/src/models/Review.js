import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'Review must be associated with a gig'],
    },
    bidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      required: [true, 'Review must be associated with a bid'],
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewer (client/gig owner)'],
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewee (freelancer)'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      default: '',
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per hired gig per client
reviewSchema.index({ gigId: 1, bidId: 1, reviewerId: 1 }, { unique: true });

// Index for fetching reviews by user
reviewSchema.index({ revieweeId: 1, createdAt: -1 });

// Index for fetching reviews by gig
reviewSchema.index({ gigId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
