const { onAuthStateChanged } = require('firebase/auth');
// import the auth you made instead
const { auth } = require('../firebase/firebase');

// helper functions
const authMiddleware = (req, res, next) => {
    onAuthStateChanged(auth, user => {
      req.user = user
      console.log(req.user)
      // if there is no user signed it
      if(!req.user) {
        res.json({message: 'You are not authorized to access this!'})
      } else {
        next();
      }
    })
  // console.log(req.session);
  // if (!req.session.userToken) {
  //   res.status(401).json({
  //     status: 'error',
  //     code: 401,
  //     message: "You are not authorized. Please login!",
  //     data: 'Unathorized',
  //   });
  //   return;
  // } else {
  //   // if the token exists, go on!
  //   next();
  // }
};

module.exports = authMiddleware;
