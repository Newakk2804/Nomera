import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import {
  main,
  statisticsDisplay,
  currentOrdersCourierDisplay,
  currentOrdersDetailDisplay,
  completedOrdersCourierDisplay,
  canceledOrdersCourierDisplay,
  infoCourierDisplay,
} from '../controllers/courierController.mjs';

const router = Router();

router.get('/', ensureAuthenticated, main);
router.get('/statistics', ensureAuthenticated, statisticsDisplay);
router.get('/current-orders', ensureAuthenticated, currentOrdersCourierDisplay);
router.get('/current-orders/:orderId', ensureAuthenticated, currentOrdersDetailDisplay);
router.get('/completed-orders', ensureAuthenticated, completedOrdersCourierDisplay);
router.get('/canceled-orders', ensureAuthenticated, canceledOrdersCourierDisplay);
router.get('/courier-info', ensureAuthenticated, infoCourierDisplay);
router.post('/courier-info/edit', ensureAuthenticated);

export default router;
