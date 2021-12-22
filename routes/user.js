const passport = require('../passport');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const { isLoginedUser, isAuthenticatedUser } = require('../middlewares/auth');
const ErrorHandler = require('../utils/errorHandler');

const router = require('express').Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user
 *     response:
 *      '200':
 *          description: Successfully registered
 *       
 */

router.post('/register', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    const { userName, password } = req.body;
    if (!userName || !password)
        return next(new ErrorHandler(400, "Please provide userName and password"));
    let user = await User.findOne({ where: { userName } });
    if (user)
        return next(new ErrorHandler(400, "User already exists"));
    await User.create({ userName, password, });
    res.status(200).json({ message: 'Successfully registered' });
}))

router.post('/login', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    if (!req.body.userName)
        return next(new ErrorHandler(400, "Please provide userName"));
    if (!req.body.password)
        return next(new ErrorHandler(400, "Please provide password"));

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return next(new ErrorHandler(400, info.message));
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            res.status(200).json({ message: 'Successfully logged in' });
        });
    })(req, res, next);

}));

router.post('/logout', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    req.logOut();
    res.status(200).json({ message: 'Successfully logged out' });
}));

module.exports = router;