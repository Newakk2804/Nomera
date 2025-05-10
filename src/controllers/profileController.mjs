import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const profileDisplay = (req, res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
    user: req.user,
  };

  res.render('profile', locals);
};

export const listOrderDisplay = async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.render('partials/user/orders', { layout: false, orders });
};

export const currentOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('arrayDishes.food');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.json(order);
  } catch (err) {
    console.error('Ошибка при получении заказа: ', err);
    res.status(500).json({ message: 'Ошибка при получении данных заказа' });
  }
};

export const infoDisplay = (req, res) => {
  res.render('partials/user/info', { layout: false, user: req.user });
};

export const infoUpdate = async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    await user.save();

    res.json({ message: 'Данные успешно обновлены', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера', success: false });
  }
};

export const addressesDisplay = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('partials/user/addresses', { layout: false, user });
};

export const addressesNewAdd = async (req, res) => {
  const { address } = req.body;

  if (!address || address.trim() === '') {
    console.log(address);
    return res.status(400).json({ success: false, message: 'Адрес не может быть пустым' });
  }

  const user = await User.findById(req.user._id);
  user.addresses.push(address.trim());
  await user.save();

  res.json({ success: true });
};

export const addressesDelete = async (req, res) => {
  const index = parseInt(req.params.index);
  const user = await User.findById(req.user._id);

  if (isNaN(index) || index < 0 || index >= user.addresses.length) {
    return res.status(400).json({ success: false, message: 'Некорректный индекс' });
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.json({ success: true });
};

export const cardsDisplay = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    user.stripeCustomerId = customer.id;
    await user.save();
  }

  const cards = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: 'card',
  });

  res.render('partials/user/cards', {
    layout: false,
    cards: cards.data,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

export const createSetupIntent = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    user.stripeCustomerId = customer.id;
    await user.save();
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: user.stripeCustomerId,
  });

  res.json({ clientSecret: setupIntent.client_secret });
};

export const deleteCards = async (req, res) => {
  const { id } = req.params;

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(id);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Платежный метод не найден в Stripe' });
    }

    await stripe.paymentMethods.detach(id);

    res.json({ success: true, message: 'Карта удалена успешно' });
  } catch (error) {
    console.error('Ошибка при удалении карты:', error);
    res.status(500).json({ message: 'Ошибка при удалении карты' });
  }
};

export const favoritesFoodDisplay = async (req, res) => {
  const foods = await User.findById(req.user._id).populate('featuredFood');
  res.render('partials/user/favorites', { layout: false, foods: foods.featuredFood });
};
