import { Router } from 'express';
import Food from '../models/Foods.mjs';
import Category from '../models/Categories.mjs';
import foodsRouter from './food.mjs';
import aboutRouter from './about.mjs';
import contactRouter from './contact.mjs';
import authRouter from './auth.mjs';
import favoriteRouter from './favorite.mjs';
import cartRouter from './cart.mjs';
import profileRouter from './profile.mjs';
import orderRouter from './order.mjs';
import adminRouter from './admin.mjs';

const router = Router();

router.get('/', async (req, res) => {
  const foods = await Food.find();
  const categories = await Category.find();

  const locals = {
    title: 'Главная',
    foods: foods,
    categories: categories,
    activePage: 'food',
  };

  res.render('index', locals);
});

router.use('/foods', foodsRouter);
router.use('/about', aboutRouter);
router.use('/contact', contactRouter);
router.use('/auth', authRouter);
router.use('/favorite', favoriteRouter);
router.use('/cart', cartRouter);
router.use('/profile', profileRouter);
router.use('/order', orderRouter);
router.use('/admin', adminRouter);

export default router;
