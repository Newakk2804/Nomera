export const main = (req ,res) => {
  const locals = {
    title: 'О нас',
    activePage: 'about',
  };

  res.render('about', locals);
}