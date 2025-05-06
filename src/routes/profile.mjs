import { Router } from 'express';
import User from '../models/Users.mjs';
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

router.get('/orders', ensureAuthenticated, (req, res) => {
  res.render('partials/orders', { layout: false });
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
