import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
