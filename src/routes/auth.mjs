import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/Users.mjs';
import { loginValidation, registerValidation } from '../validators/authValidator.mjs';
import { validationResult } from 'express-validator';

const router = Router();

router.get('/login', (req, res) => {
  const locals = {
    title: 'Вход',
    activePage: '',
    errors: {},
    email: '',
  };

  res.render('login', locals);
});

router.get('/register', (req, res) => {
  const locals = {
    title: 'Регистрация',
    activePage: '',
    errors: {},
    old: { name: '', email: '', address: '' },
  };

  res.render('register', locals);
});

router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, secondPassword, address } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Регистрация',
      activePage: '',
      errors: errors.mapped(),
      old: { name, email, address },
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Регистрация',
        activePage: '',
        errors: {email: {msg: 'Пользователь с таким email уже существует'}},
        old: {name, email, address},
      });
    }

    if(password !== secondPassword) {
      return res.render('register', {
        title: 'Регистрация',
        activePage: '',
        erros: {secondPassword: {msg: 'Пароли не совпадают'}},
        old: {name, email, address},
      })
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash, address, role: 'user' });

    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
});

router.post('/login', loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', {
      title: 'Вход',
      activePage: '',
      errors: errors.mapped(),
      email: req.body.email,
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('login', {
        title: 'Вход',
        activePage: '',
        errors: { email: { msg: 'Неверный email или пароль' } },
        email: req.body.email,
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
