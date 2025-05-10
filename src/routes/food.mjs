import { Router } from 'express';
import Food from '../models/Foods.mjs';
import Cart from '../models/Carts.mjs';

const router = Router();

router.get('/by-category/:id', async (req, res) => {
  try {
    const foods = await Food.find({ category: req.params.id });
    res.json({ foods, featuredFood: req.user ? req.user.featuredFood : [], user: req.user ? req.user : '' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка загрузки блюд по категории' });
  }
});

router.get('/detail/:id', async (req, res) => {
  const foodId = req.params.id;
  const userId = req.user?._id;
  
  try {
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ error: 'Блюдо не найдено' });

    const cart = await Cart.findOne({owner: userId});
    let quantityInCart = 0;

    if(cart) {
      const item = cart.items.find(item => item.food.toString() === foodId);
      if(item) {
        quantityInCart = item.quantity;
      }
    }

    res.json({
      id: food.id,
      title: food.title,
      description: food.description,
      price: food.price,
      imageUrl: food.imageUrl,
      weight: food.weight,
      nutritionalValue: {
        calories: food.nutritionalValue.calories,
        protein: food.nutritionalValue.protein,
        fat: food.nutritionalValue.fat,
        carbs: food.nutritionalValue.carbs,
      },
      quantityInCart
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
