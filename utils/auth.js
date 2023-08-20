// helper functions 
const auth = (req, res, next) => {
    console.log(req.session)
    if(!req.session.userToken) {
        res.json({message: 'You are not authorized. Please login!'});
        return;
    } else {
        // if the token exists, go on!
        next();
    }
};

module.exports = auth; 
