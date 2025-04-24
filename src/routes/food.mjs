import { Router } from 'express';
import Food from '../models/Foods.mjs';

const router = Router();

router.get('/by-category/:id', async (req, res) => {
  try {
    const foods = await Food.find({ category: req.params.id });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки блюд по категории' });
  }
});

export default router;
