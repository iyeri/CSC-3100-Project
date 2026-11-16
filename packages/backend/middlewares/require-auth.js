export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).send("Authentication required.");
  }

  return next();
}
