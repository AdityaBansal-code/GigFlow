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

  // The gig update is the deciding write: it only matches while the gig is still open,
  // so of several concurrent hire requests exactly one can claim it.
  const claimedGig = await Gig.findOneAndUpdate(
    { _id: bid.gigId._id, status: 'open' },
    { status: 'assigned' },
    { new: true }
  );
  if (!claimedGig) {
    throw new BadRequestError('Gig is no longer available or already assigned');
  }

  const hiredBid = await Bid.findOneAndUpdate(
    { _id: bidId, gigId: bid.gigId._id, status: 'pending' },
    { status: 'hired' },
    { new: true }
  ).populate('freelancerId', 'name email').populate('gigId');

  if (!hiredBid) {
    // The bid changed (for example, it was withdrawn) after the gig was claimed: release the gig.
    await Gig.updateOne({ _id: bid.gigId._id, status: 'assigned' }, { status: 'open' });
    throw new BadRequestError('Bid is no longer available or already processed');
  }

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
