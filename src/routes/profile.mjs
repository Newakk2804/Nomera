import { Router } from 'express';
import User from '../models/Users.mjs';
import Order from '../models/Orders.mjs';
import { ensureAuthenticated } from '../middlewares/auth.mjs';

const router = Router();

router.get('/', (req, res) => {
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

router.get('/cards', ensureAuthenticated, (req, res) => {
  res.render('partials/cards', { layout: false });
});

router.get('/favorites', ensureAuthenticated, async (req, res) => {
  const foods = await User.findById(req.user._id).populate('featuredFood');
  res.render('partials/favorites', { layout: false, foods: foods.featuredFood });
});

export default router;
