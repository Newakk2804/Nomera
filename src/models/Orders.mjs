import mongoose from 'mongoose';

const OrderSchema = mongoose.Schema(
  {
    arrayDishes: [
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
      enum: ['Принят', 'Готовится', 'В пути', 'Доставлен', 'Отменен'],
      required: true,
    },
    totalPrice: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    paymentMethod: {
      type: mongoose.Schema.Types.String,
      enum: ['Наличными курьеру', 'Картой курьеру', 'Оплата онлайн'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
