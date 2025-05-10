import Cart from '../models/Carts.mjs';
import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

export const displayPlacingOrder = async (req, res) => {
  const locals = {
    title: 'Оформление заказа',
    activePage: '',
  };

  const user = await User.findById(req.user._id);
  const cart = await Cart.findOne({ owner: user._id }).populate('items.food');
  let cards = [];

  if (user.stripeCustomerId) {
    const paymentMethods = await stripeClient.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });
    cards = paymentMethods.data.map((card) => ({
      id: card.id,
      last4: card.card.last4,
      exp_month: card.card.exp_month,
      exp_year: card.card.exp_year,
      brand: card.card.brand,
    }));
  }

  res.render('placing_order', { ...locals, user, cards, cart });
};

export const placingOrder = async (req, res) => {
  try {
    const { address, paymentMethod, selectedCard } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const cart = await Cart.findOne({ owner: userId }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).send('Корзина пуста');
    }

    let isPaid = false;

    if (paymentMethod === 'Оплата онлайн') {
      if (!user.stripeCustomerId || !selectedCard) {
        return res.status(400).send('Не выбрана карта или отсутствует Stripe-профиль');
      }

      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(cart.totalPrice * 100),
        currency: 'byn',
        customer: user.stripeCustomerId,
        payment_method: selectedCard,
        off_session: true,
        confirm: true,
      });

      isPaid = paymentIntent.status === 'succeeded';
    }

    const order = new Order({
      arrayDishes: cart.items.map((item) => ({
        food: item.food._id,
        quantity: item.quantity,
      })),
      owner: userId,
      address,
      status: 'Принят',
      totalPrice: cart.totalPrice,
      paymentMethod,
      isPaid,
    });

    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.redirect('/order/success');
  } catch (err) {
    console.error(err);

    if (err.code === 'authentication_required') {
      return res.status(402).send('Ошибка Stripe: требуется повторная аутентификация');
    }

    res.status(500).send('Ошибка при оформлении заказа');
  }
};

export const displaySuccess = (req, res) => {
  const locals = {
    title: 'Заказ оформлен',
    activePage: '',
  };

  res.render('order_success', locals);
};
