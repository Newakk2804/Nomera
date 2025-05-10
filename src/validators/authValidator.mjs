import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Введите корректный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не короче 6 символов')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage(
      'Пароль должен содержать хотя бы одну цифру, одну заглавную и одну строчную букву'
    ),
  body('secondPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Пароли не совпадают'),
  body('firstName').notEmpty().withMessage('Имя не может быть пустым'),
  body('lastName').notEmpty().withMessage('Фамилия не может быть пустой'),
  body('phone')
    .notEmpty()
    .withMessage('Номер телефона обязателен')
    .matches(/^\+?\d{10,15}$/)
    .withMessage('Введите корректный номер телефона'),
  body('address').notEmpty().withMessage('Адрес не может быть пустым'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Введите правильный Email'),
  body('password').notEmpty().withMessage('Пароль не может быть пустым'),
];

export const checkUserValidation = [
  body('checkUser')
    .notEmpty()
    .withMessage('Поле не может быть пустым')
    .isEmail()
    .withMessage('Введите корректный Email'),
];

export const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Введите старый пароль'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не короче 6 символов')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage(
      'Пароль должен содержать хотя бы одну цифру, одну заглавную и одну строчную букву'
    ),

  body('againPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Пароли не совпадают'),
];
