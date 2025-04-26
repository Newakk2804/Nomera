import express from 'express';
import expressLayout from 'express-ejs-layouts';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './src/config/passport.mjs';
import connectDB from './src/config/db.mjs';
import mainRouter from './src/routes/main_router.mjs';

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server on running port: ${process.env.PORT}`);
});
