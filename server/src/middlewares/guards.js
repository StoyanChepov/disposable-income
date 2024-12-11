function isUser() {
  return (req, res, next) => {
    console.log("isUser", req.user);
    if (req.user) {
      next();
    } else {
      res.send(["You need to be logged in to access this page!"]).status(401);
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    console.log("isGuest", req.user);
    if (!req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
}

module.exports = {
  isUser,
  isGuest,
};
