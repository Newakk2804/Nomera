import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    featuredFood: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: false,
      },
    ],
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: false,
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.String,
      enum: ['user', 'admin', 'courier'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
