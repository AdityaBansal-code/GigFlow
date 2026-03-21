import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';
import Review from '../models/Review.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user info
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Fetch gigs posted by user (client perspective)
  const postedGigs = await Gig.find({ ownerId: userId })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Fetch bids received on user's gigs
  const gigsOwned = await Gig.find({ ownerId: userId }).select('_id');
  const gigIds = gigsOwned.map(gig => gig._id);
  
  const receivedBids = await Bid.find({ gigId: { $in: gigIds } })
    .populate('freelancerId', 'name email profilePhoto avgRating')
    .populate('gigId', 'title')
    .sort({ createdAt: -1 })
    .limit(20);

  // Fetch hired freelancers (bids with status 'hired' on user's gigs)
  const hiredFreelancers = await Bid.find({
    gigId: { $in: gigIds },
    status: 'hired',
  })
    .populate('freelancerId', 'name email profilePhoto avgRating')
    .populate('gigId', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  // Fetch bids submitted by user (freelancer perspective)
  const submittedBids = await Bid.find({ freelancerId: userId })
    .populate('gigId', 'title budget status ownerId')
    .populate('gigId.ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(20);

  // Fetch hired projects (bids with status 'hired' where user is freelancer)
  const hiredProjects = await Bid.find({
    freelancerId: userId,
    status: 'hired',
  })
    .populate('gigId', 'title budget ownerId')
    .populate('gigId.ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  // Fetch reviews received by user
  const receivedReviews = await Review.find({ revieweeId: userId })
    .populate('reviewerId', 'name email profilePhoto')
    .populate('gigId', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  // Calculate stats
  const stats = {
    postedGigsCount: gigsOwned.length,
    submittedBidsCount: await Bid.countDocuments({ freelancerId: userId }),
    receivedBidsCount: await Bid.countDocuments({ gigId: { $in: gigIds } }),
    hiredProjectsCount: await Bid.countDocuments({
      freelancerId: userId,
      status: 'hired',
    }),
    hiredFreelancersCount: hiredFreelancers.length,
    avgRating: user.avgRating,
    totalReviews: user.totalReviews,
  };

  const dashboard = {
    user,
    asClient: {
      postedGigs,
      receivedBids,
      hiredFreelancers,
    },
    asFreelancer: {
      submittedBids,
      hiredProjects,
      receivedReviews,
    },
    stats,
  };

  successResponse(res, 200, dashboard);
});
