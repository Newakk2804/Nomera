import { Router } from 'express';
import Food from '../models/Foods.mjs';
import Category from '../models/Categories.mjs';

const router = Router();

router.get('/', async (req, res) => {
  const foods = await Food.find();
  const categories = await Category.find();

  const locals = {
    title: 'Главная',
    foods: foods,
    categories: categories,
  };

  res.render('index', locals);
});

export default router;
