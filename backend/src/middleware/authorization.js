import { ForbiddenError } from '../utils/errors.js';
import Gig from '../models/Gig.js';

export const isGigOwner = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    
    const gig = await Gig.findById(gigId);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('You are not authorized to perform this action');
    }

    req.gig = gig;
    next();
  } catch (error) {
    next(error);
  }
};
