import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import {
  profileDisplay,
  listOrderDisplay,
  currentOrderDetail,
  infoDisplay,
  infoUpdate,
  addressesDisplay,
  addressesNewAdd,
  addressesDelete,
  cardsDisplay,
  createSetupIntent,
  deleteCards,
  favoritesFoodDisplay,
} from '../controllers/profileController.mjs';

const router = Router();

router.get('/', ensureAuthenticated, profileDisplay);
router.get('/orders', ensureAuthenticated, listOrderDisplay);
router.get('/orders/:id', ensureAuthenticated, currentOrderDetail);
router.get('/info', ensureAuthenticated, infoDisplay);
router.post('/info/edit', ensureAuthenticated, infoUpdate);
router.get('/addresses', ensureAuthenticated, addressesDisplay);
router.post('/addresses', ensureAuthenticated, addressesNewAdd);
router.delete('/addresses/:index', ensureAuthenticated, addressesDelete);
router.get('/cards', ensureAuthenticated, cardsDisplay);
router.post('/payments/create-setup-intent', ensureAuthenticated, createSetupIntent);
router.delete('/payments/delete-card/:id', deleteCards);
router.get('/favorites', ensureAuthenticated, favoritesFoodDisplay);

export default router;
