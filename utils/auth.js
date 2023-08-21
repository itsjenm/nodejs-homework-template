// helper functions
const auth = (req, res, next) => {
  console.log(req.session);
  if (!req.session.userToken) {
    res.status(401).json({
      status: 'error',
      code: 401,
      message: "You are not authorized. Please login!",
      data: 'Unathorized',
    });
    return;
  } else {
    // if the token exists, go on!
    next();
  }
};

module.exports = auth;
