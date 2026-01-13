import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: [true, 'Bid must be associated with a gig'],
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bid must have a freelancer'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'hired', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

bidSchema.index({ gigId: 1 });
bidSchema.index({ status: 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
