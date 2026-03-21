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
    category: {
      type: String,
      enum: ['Web Dev', 'Design', 'Writing', 'Marketing', 'Data', 'Other'],
      default: 'Other',
    },
    deadline: {
      type: Date,
      default: null,
    },
    difficulty: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  {
    timestamps: true,
  }
);

gigSchema.index({ status: 1 });
gigSchema.index({ title: 'text' });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ difficulty: 1 });

gigSchema.virtual('isOpen').get(function () {
  return this.status === 'open';
});

const Gig = mongoose.model('Gig', gigSchema);

export default Gig;
