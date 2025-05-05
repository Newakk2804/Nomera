export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();

  const wantsJSON = req.headers.accept?.includes('application/json') || req.headers['content-type']?.includes('application/json');

  if (wantsJSON) {
    return res.status(401).json({ success: false, message: 'Требуется авторизация' });
  }

  res.redirect('/');
}
