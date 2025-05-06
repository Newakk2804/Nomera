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

router.get('/addresses', ensureAuthenticated, (req, res) => {
  res.render('partials/addresses', { layout: false });
});

router.get('/cards', ensureAuthenticated, (req, res) => {
  res.render('partials/cards', { layout: false });
});

router.get('/favorites', ensureAuthenticated, (req, res) => {
  res.render('partials/favorites', { layout: false });
});

export default router;
