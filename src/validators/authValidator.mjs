import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не короче 6 символов')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    .withMessage(
      'Пароль должен содержать хотя бы одну цифру, одну заглавную и одну строчную букву'
    ),
  body('secondPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Пароли не совпадают'),
  body('name').notEmpty().withMessage('Имя не может быть пустым'),
  body('address').notEmpty().withMessage('Адрес не может быть пустым'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Введите правильный Email'),
  body('password').notEmpty().withMessage('Пароль не может быть пустым'),
];
