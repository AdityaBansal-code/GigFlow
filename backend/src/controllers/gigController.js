import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

export const getAllGigs = asyncHandler(async (req, res) => {
  const { search, category, difficulty, sortBy } = req.query;

  const query = { status: 'open' };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  let sort = { createdAt: -1 };
  if (sortBy === 'budgetAsc') {
    sort = { budget: 1 };
  } else if (sortBy === 'budgetDesc') {
    sort = { budget: -1 };
  } else if (sortBy === 'deadlineAsc') {
    sort = { deadline: 1, createdAt: -1 };
  }

  const gigs = await Gig.find(query)
    .populate('ownerId', 'name email')
    .sort(sort);

  successResponse(res, 200, gigs);
});

export const createGig = asyncHandler(async (req, res) => {
  const { title, description, budget, category, deadline, difficulty } = req.body;

  const ownerId = req.user._id;

  const gig = await Gig.create({
    title,
    description,
    budget,
    category,
    deadline,
    difficulty,
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

export const updateGig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { title, description, budget, category, deadline, difficulty } = req.body;

  const gig = await Gig.findById(id);

  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  // Authorization: Only gig owner can update
  if (gig.ownerId.toString() !== userId.toString()) {
    throw new ForbiddenError('You are not authorized to update this gig');
  }

  // Can only update if gig is still open
  if (gig.status !== 'open') {
    throw new BadRequestError('Cannot update a gig that is not open');
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (budget !== undefined) updateData.budget = budget;
  if (category !== undefined) updateData.category = category;
  if (deadline !== undefined) updateData.deadline = deadline;
  if (difficulty !== undefined) updateData.difficulty = difficulty;

  const updatedGig = await Gig.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('ownerId', 'name email');

  successResponse(res, 200, updatedGig, 'Gig updated successfully');
});

export const deleteGig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const gig = await Gig.findById(id);

  if (!gig) {
    throw new NotFoundError('Gig not found');
  }

  // Authorization: Only gig owner can delete
  if (gig.ownerId.toString() !== userId.toString()) {
    throw new ForbiddenError('You are not authorized to delete this gig');
  }

  // Can only delete if gig is still open
  if (gig.status !== 'open') {
    throw new BadRequestError('Cannot delete a gig that has been assigned');
  }

  // Check if there are any hired bids (should not exist if status is 'open', but verify)
  const hiredBids = await Bid.countDocuments({ gigId: id, status: 'hired' });
  if (hiredBids > 0) {
    throw new BadRequestError('Cannot delete a gig with hired freelancers');
  }

  await Gig.findByIdAndDelete(id);

  successResponse(res, 200, null, 'Gig deleted successfully');
});
