import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

export const hireFreelancer = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  const bid = await Bid.findById(bidId).populate('gigId');

  if (!bid) {
    throw new NotFoundError('Bid not found');
  }

  if (!bid.gigId) {
    throw new NotFoundError('Gig not found');
  }

  if (bid.gigId.ownerId.toString() !== req.user._id.toString()) {
    throw new ForbiddenError('You are not authorized to hire for this gig');
  }

  const currentGig = await Gig.findById(bid.gigId._id);
  if (!currentGig || currentGig.status !== 'open') {
    throw new BadRequestError('Gig is no longer available or already assigned');
  }

  const currentBid = await Bid.findById(bidId);
  if (!currentBid || currentBid.status !== 'pending') {
    throw new BadRequestError('Bid is no longer available or already processed');
  }

  const hiredBid = await Bid.findByIdAndUpdate(
    bidId,
    { status: 'hired' },
    { new: true }
  ).populate('freelancerId', 'name email').populate('gigId');

  await Gig.findByIdAndUpdate(
    bid.gigId._id,
    { status: 'assigned' },
    { new: true }
  );

  await Bid.updateMany(
    {
      gigId: bid.gigId._id,
      _id: { $ne: bidId },
      status: 'pending',
    },
    {
      status: 'rejected',
    }
  );

  successResponse(res, 200, {
    bid: hiredBid,
    gig: hiredBid.gigId,
  }, 'Freelancer hired successfully');
});
