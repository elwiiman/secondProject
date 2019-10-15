exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

exports.toProfile = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return next();
};
