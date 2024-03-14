const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
  };
};

module.exports = checkRole;
