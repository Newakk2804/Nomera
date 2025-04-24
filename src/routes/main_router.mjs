import { Router } from 'express';
import Food from '../models/Foods.mjs';
import Category from '../models/Categories.mjs';
import foodsRouter from './food.mjs';
import aboutRouter from './about.mjs';

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

export default router;
