import { Router } from 'express';
import Food from '../models/Foods.mjs';

const router = Router();

router.get('/by-category/:id', async (req, res) => {
  try {
    const foods = await Food.find({ category: req.params.id });
    res.json({ foods, featuredFood: req.user ? req.user.featuredFood : [] });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки блюд по категории' });
  }
});

router.get('/detail/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: 'Блюдо не найдено' });
    res.json({
      title: food.title,
      description: food.description,
      price: food.price,
      imageUrl: food.imageUrl,
      rating: food.rating,
      nutritionalValue: {
        calories: food.nutritionalValue.calories,
        protein: food.nutritionalValue.protein,
        fat: food.nutritionalValue.fat,
        carbs: food.nutritionalValue.carbs,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
