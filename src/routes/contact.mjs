import { Router } from "express";

const router = Router();

router.get('/', (req ,res) => {
  const locals = {
    title: 'Контакты',
    activePage: 'contact',
  };

  res.render('contact', locals);
})

export default router;