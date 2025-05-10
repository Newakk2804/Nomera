import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import {
  displayPlacingOrder,
  placingOrder,
  displaySuccess,
} from '../controllers/orderController.mjs';

const router = Router();

router.get('/', ensureAuthenticated, displayPlacingOrder);
router.post('/', ensureAuthenticated, placingOrder);
router.get('/success', ensureAuthenticated, displaySuccess);

export default router;
