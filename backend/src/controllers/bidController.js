import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from '../utils/errors.js';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

export const createBid = asyncHandler(async (req, res) => {
  const { gigId, message, price } = req.body;

  const freelancerId = req.user._id;

  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  if (gig.status !== 'open') {
    throw new BadRequestError('Cannot bid on a gig that is not open');
  }

  if (gig.ownerId.toString() === freelancerId.toString()) {
    throw new ForbiddenError('You cannot bid on your own gig');
  }

  const existingBid = await Bid.findOne({ gigId, freelancerId });
  if (existingBid) {
    throw new ConflictError('You have already placed a bid on this gig');
  }

  const bid = await Bid.create({
    gigId,
    freelancerId,
    message,
    price,
    status: 'pending',
  });

  await bid.populate('freelancerId', 'name email');

  successResponse(res, 201, bid, 'Bid created successfully');
});

export const getBidsByGig = asyncHandler(async (req, res) => {
  const { gigId } = req.params;

  const gig = await Gig.findById(gigId);
  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  if (gig.ownerId.toString() !== req.user._id.toString()) {
    throw new ForbiddenError('You are not authorized to view bids for this gig');
  }

  const bids = await Bid.find({ gigId })
    .populate('freelancerId', 'name email')
    .sort({ createdAt: -1 });

  successResponse(res, 200, bids);
});
