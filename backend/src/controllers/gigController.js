import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import Gig from '../models/Gig.js';

export const getAllGigs = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const query = { status: 'open' };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const gigs = await Gig.find(query)
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });

  successResponse(res, 200, gigs);
});

export const createGig = asyncHandler(async (req, res) => {
  const { title, description, budget } = req.body;

  const ownerId = req.user._id;

  const gig = await Gig.create({
    title,
    description,
    budget,
    ownerId,
  });

  await gig.populate('ownerId', 'name email');

  successResponse(res, 201, gig, 'Gig created successfully');
});

export const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  successResponse(res, 200, gig);
});
