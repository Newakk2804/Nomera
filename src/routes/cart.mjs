import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import {
  cartView,
  addDishToCart,
  decreaseDishToCart,
  increaseDishToCart,
  removeDishToCart,
} from '../controllers/cartController.mjs';

const router = Router();

router.get('/view', ensureAuthenticated, cartView);
router.post('/add/:id', ensureAuthenticated, addDishToCart);
router.post('/decrease/:id', ensureAuthenticated, decreaseDishToCart);
router.post('/increase/:id', ensureAuthenticated, increaseDishToCart);
router.delete('/remove/:id', ensureAuthenticated, removeDishToCart);

export default router;
