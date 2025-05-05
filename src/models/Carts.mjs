import mongoose from 'mongoose';

const CartSchema = mongoose.Schema(
  {
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: false,
        },
        quantity: {
          type: mongoose.Schema.Types.Number,
          required: true,
          default: 1,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);
