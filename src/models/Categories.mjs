import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export default mongoose.model('Category', CategorySchema);
