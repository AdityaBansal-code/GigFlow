import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    budget: {
      type: Number,
      required: [true, 'Please provide a budget'],
      min: [0, 'Budget must be a positive number'],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Gig must have an owner'],
    },
    status: {
      type: String,
      enum: ['open', 'assigned'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

gigSchema.index({ status: 1 });
gigSchema.index({ title: 'text' });

gigSchema.virtual('isOpen').get(function () {
  return this.status === 'open';
});

const Gig = mongoose.model('Gig', gigSchema);

export default Gig;
