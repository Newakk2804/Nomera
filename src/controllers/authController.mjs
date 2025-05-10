import passport from 'passport';
import bcrypt from 'bcrypt';
import User from '../models/Users.mjs';
import { validationResult } from 'express-validator';

export const loginDisplay = (req, res) => {
  const locals = {
    title: 'Вход',
    activePage: '',
    errors: {},
    email: '',
  };

  res.render('login', locals);
};

export const registerDisplay = (req, res) => {
  const locals = {
    title: 'Регистрация',
    activePage: '',
    errors: {},
    old: { firstName: '', lastName: '', email: '', address: '', phone: '' },
  };

  res.render('register', locals);
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  const { firstName, lastName, email, password, secondPassword, address, phone } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Регистрация',
      activePage: '',
      errors: errors.mapped(),
      old: { firstName, lastName, email, address, phone },
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Регистрация',
        activePage: '',
        errors: { email: { msg: 'Пользователь с таким email уже существует' } },
        old: { firstName, lastName, email, address, phone },
      });
    }

    if (password !== secondPassword) {
      return res.render('register', {
        title: 'Регистрация',
        activePage: '',
        erros: { secondPassword: { msg: 'Пароли не совпадают' } },
        old: { firstName, lastName, email, address, phone },
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      addresses: [address],
      phone,
      role: 'user',
    });

    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const login = (req, res, next) => {
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
};

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

export const checkUserDisplay = (req, res) => {
  const locals = {
    title: 'Проверка пользователя',
    activePage: '',
    errors: [],
    checkUser: '',
  };

  res.render('check_user', locals);
};

export const checkUser = async (req, res) => {
  const errors = validationResult(req);
  const { checkUser } = req.body;

  if (!errors.isEmpty()) {
    const locals = {
      title: 'Проверка пользователя',
      activePage: '',
      errors: errors.array(),
      checkUser,
    };
    return res.status(422).render('check_user', locals);
  }

  try {
    const findUser = await User.findOne({ email: checkUser });

    if (!findUser) {
      const locals = {
        title: 'Проверка пользователя',
        activePage: '',
        errors: [{ msg: 'Пользователь не найден' }],
        checkUser,
      };
      return res.status(422).render('check_user', locals);
    }
    req.session.userId = findUser._id;
    res.redirect('/auth/change-password');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const changePasswordDisplay = (req, res) => {
  const locals = {
    title: 'Изменение пароля',
    activePage: '',
    errors: [],
    checkUser: '',
    formData: {},
  };

  res.render('change_password', locals);
};

export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  const formData = req.body;
  let userId = '';
  if (!req.user) {
    userId = req.session.userId;
  } else {
    userId = req.user._id;
  }

  if (!errors.isEmpty()) {
    const locals = {
      title: 'Изменение пароля',
      activePage: '',
      errors: errors.array(),
      formData,
    };
    return res.status(422).render('change_password', locals);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      const locals = {
        title: 'Изменение пароля',
        activePage: '',
        errors: [{ msg: 'Пользователь не найден' }],
        formData,
      };
      return res.status(422).render('change_password', locals);
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      const locals = {
        title: 'Изменение пароля',
        activePage: '',
        errors: [{ msg: 'Старый пароль неверен' }],
        formData,
      };
      return res.status(422).render('change_password', locals);
    }

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = newHashedPassword;
    await user.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    const locals = {
      title: 'Изменение пароля',
      activePage: '',
      errors: [{ msg: 'Произошла ошибка. Попробуйте позже.' }],
      formData,
    };
    res.status(500).render('change_password', locals);
  }
};
