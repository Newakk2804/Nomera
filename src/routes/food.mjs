import { Router } from 'express';
import { displayFoodByCategory, displayDetailFood } from '../controllers/foodController.mjs';

const router = Router();

router.get('/by-category/:id', displayFoodByCategory);
router.get('/detail/:id', displayDetailFood);

export default router;
