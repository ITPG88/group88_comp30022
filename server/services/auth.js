function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/home");
  } else {
    return next();
  }
}
function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = {
  ensureAuth,
  ensureGuest,
  forwardAuthenticated,
};
