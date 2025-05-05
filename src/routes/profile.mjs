import { Router } from "express";

const router = Router();

router.get('/', (req ,res) => {
  const locals = {
    title: 'Личный кабинет',
    activePage: '',
  };

  res.render('profile', locals);
})

export default router;