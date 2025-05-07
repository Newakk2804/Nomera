import { Router } from 'express';
import dotenv from 'dotenv';
import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import Stripe from 'stripe';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.get('/', ensureAuthenticated, (req, res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
    user: req.user,
  };

  res.render('profile', locals);
});

router.get('/orders', ensureAuthenticated, async (req, res) => {
  const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.render('partials/orders', { layout: false, orders });
});

router.get('/orders/:id', ensureAuthenticated, async (req, res) => {
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
});

router.get('/info', ensureAuthenticated, (req, res) => {
  res.render('partials/info', { layout: false, user: req.user });
});

router.post('/info/edit', ensureAuthenticated, async (req, res) => {
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
});

router.get('/addresses', ensureAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('partials/addresses', { layout: false, user });
});

router.post('/addresses', ensureAuthenticated, async (req, res) => {
  const { address } = req.body;

  if (!address || address.trim() === '') {
    console.log(address);
    return res.status(400).json({ success: false, message: 'Адрес не может быть пустым' });
  }

  const user = await User.findById(req.user._id);
  user.addresses.push(address.trim());
  await user.save();

  res.json({ success: true });
});

router.delete('/addresses/:index', ensureAuthenticated, async (req, res) => {
  const index = parseInt(req.params.index);
  const user = await User.findById(req.user._id);

  if (isNaN(index) || index < 0 || index >= user.addresses.length) {
    return res.status(400).json({ success: false, message: 'Некорректный индекс' });
  }

  user.addresses.splice(index, 1);
  await user.save();

  res.json({ success: true });
});

router.get('/cards', ensureAuthenticated, async (req, res) => {
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

  res.render('partials/cards', {
    layout: false,
    cards: cards.data,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post('/payments/create-setup-intent', ensureAuthenticated, async (req, res) => {
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
});

router.delete('/payments/delete-card/:id', async (req, res) => {
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
});


router.get('/favorites', ensureAuthenticated, async (req, res) => {
  const foods = await User.findById(req.user._id).populate('featuredFood');
  res.render('partials/favorites', { layout: false, foods: foods.featuredFood });
});

export default router;
