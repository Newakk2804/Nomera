import mongoose from 'mongoose';

const OrderSchema = mongoose.Schema(
  {
    arrayDishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    address: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['Принят', 'Готовится', 'Передан курьеру', 'В пути', 'Доставлен', 'Отменен'],
      required: true,
    },
    totalPrice: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
