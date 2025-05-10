import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import { addDishFavorite } from '../controllers/favoriteController.mjs';

const router = Router();

router.post('/add', ensureAuthenticated, addDishFavorite);

export default router;
