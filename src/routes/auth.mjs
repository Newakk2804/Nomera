import { Router } from 'express';
import {
  loginValidation,
  registerValidation,
  checkUserValidation,
  changePasswordValidation,
} from '../validators/authValidator.mjs';
import {
  loginDisplay,
  registerDisplay,
  register,
  login,
  logout,
  checkUserDisplay,
  checkUser,
  changePasswordDisplay,
  changePassword,
} from '../controllers/authController.mjs';

const router = Router();

router.get('/login', loginDisplay);
router.get('/register', registerDisplay);
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.get('/check-user', checkUserDisplay);
router.post('/check-user', checkUserValidation, checkUser);
router.get('/change-password', changePasswordDisplay);
router.post('/change-password', changePasswordValidation, changePassword);

export default router;
