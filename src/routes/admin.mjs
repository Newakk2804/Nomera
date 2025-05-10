import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/auth.mjs';
import upload from '../middlewares/uploads.mjs';
import {
  main,
  profileAdminListOrderDisplay,
  profileAdminCurrentOrderDisplay,
  assignCourierCurrentOrderDisplay,
  assignCourier,
  unassignCourier,
  updateOrderStatus,
  listCourierDisplay,
  listOrderCurrentCourier,
  displayInfoAdmin,
  infoAdminUpdate,
  displayNewDish,
  newDishAdd,
  deleteDishAdmin,
  messageAdminDisplay,
  editDishDisplay,
  editDish,
} from '../controllers/adminController.mjs';

const router = Router();

router.get('/', ensureAuthenticated, main);
router.get('/list-orders', ensureAuthenticated, profileAdminListOrderDisplay);
router.get('/list-orders/:id', ensureAuthenticated, profileAdminCurrentOrderDisplay);
router.get('/assign-courier/:orderId', ensureAuthenticated, assignCourierCurrentOrderDisplay);
router.post('/assign-courier', ensureAuthenticated, assignCourier);
router.post('/unassign-courier', ensureAuthenticated, unassignCourier);
router.post('/update-order-status', ensureAuthenticated, updateOrderStatus);
router.get('/list-courier', ensureAuthenticated, listCourierDisplay);
router.get('/courier-orders/:courierId', ensureAuthenticated, listOrderCurrentCourier);
router.get('/admin-info', ensureAuthenticated, displayInfoAdmin);
router.post('/admin-info/edit', ensureAuthenticated, infoAdminUpdate);
router.get('/admin-dish', ensureAuthenticated, displayNewDish);
router.post('/admin-dish/add', upload.single('image'), ensureAuthenticated, newDishAdd);
router.delete('/admin-dish/delete/:id', ensureAuthenticated, deleteDishAdmin);
router.get('/admin-message', ensureAuthenticated, messageAdminDisplay);
router.get('/admin-dish/edit/:id', ensureAuthenticated, editDishDisplay);
router.post('/admin-dish/edit/:id', upload.single('image'), ensureAuthenticated, editDish);

export default router;
