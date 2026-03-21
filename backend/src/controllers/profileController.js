import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';
import Review from '../models/Review.js';

export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  successResponse(res, 200, user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bio, skills, profilePhoto, portfolio } = req.body;

  const updateData = {};
  if (bio !== undefined) updateData.bio = bio;
  if (skills !== undefined) updateData.skills = skills;
  if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
  if (portfolio !== undefined) updateData.portfolio = portfolio;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  successResponse(res, 200, user, 'Profile updated successfully');
});

export const getProfileStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Count gigs posted (as client)
  const postedGigs = await Gig.countDocuments({ ownerId: userId });

  // Count bids submitted (as freelancer)
  const submittedBids = await Bid.countDocuments({ freelancerId: userId });

  // Count bids received on their gigs (as client)
  const gigsOwned = await Gig.find({ ownerId: userId }).select('_id');
  const gigIds = gigsOwned.map(gig => gig._id);
  const receivedBids = await Bid.countDocuments({ gigId: { $in: gigIds } });

  // Count hired projects (as freelancer)
  const hiredProjects = await Bid.countDocuments({
    freelancerId: userId,
    status: 'hired',
  });

  // Get user's average rating and total reviews
  const stats = {
    user,
    stats: {
      postedGigs,
      submittedBids,
      receivedBids,
      hiredProjects,
      avgRating: user.avgRating,
      totalReviews: user.totalReviews,
    },
  };

  successResponse(res, 200, stats);
});
