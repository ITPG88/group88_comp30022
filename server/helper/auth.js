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

// Ensures the current user is an admin user otherwise show restricted access error
function ensureAdmin(req, res, next) {
  return next();
}

// is admin for home page routing
function isAdmin(req, res, next) {
  // needs to be implemented
  if (/*check if user is admin*/ 0) {
    return res.redirect("/admin");
  } else {
    return next();
  }
}

function hasPriv(req, res, next) {
  // needs to be implemented
  if (/*check if user is admin or page and user id match*/ 1) {
    return next();
  } else {
    // Error no priveleges
    res.redirect("/home");
  }
}

module.exports = {
  ensureAuth,
  ensureGuest,
  isAdmin,
  ensureAdmin,
  hasPriv,
};
