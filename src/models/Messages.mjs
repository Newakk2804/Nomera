import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', MessageSchema);
