import { Router } from "express";

const router = Router();

router.get('/', (req ,res) => {
  const locals = {
    title: 'О нас',
    activePage: 'about',
  };

  res.render('about', locals);
})

export default router;