// Check if user is admin based on email
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    req.user.isAdmin = true;
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access only' });
  }
};
