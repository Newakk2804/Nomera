import mongoose from 'mongoose';

const FoodSchema = mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    imageUrl: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    weight: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    nutritionalValue: {
      calories: { type: mongoose.Schema.Types.Number, required: true },
      protein: { type: mongoose.Schema.Types.Number, required: true },
      fat: { type: mongoose.Schema.Types.Number, required: true },
      carbs: { type: mongoose.Schema.Types.Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Food', FoodSchema);
