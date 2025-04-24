import express from 'express';
import expressLayout from 'express-ejs-layouts';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.mjs';
import mainRouter from './src/routes/main_router.mjs';

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server on running port: ${process.env.PORT}`);
});
