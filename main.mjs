import express from 'express';
import expressLayout from 'express-ejs-layouts';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const locals = {
    title: 'Nomera',
  };

  res.render('index', locals);
});

app.listen(process.env.PORT, () => {
  console.log(`Server on running port: ${process.env.PORT}`);
});
