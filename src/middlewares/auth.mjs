export function ensureAutheticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
