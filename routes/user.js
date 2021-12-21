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
    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorHandler(400, "Please provide email and password"));
    let user = await User.findOne({ where: { email } });
    if (user)
        return next(new ErrorHandler(400, "User already exists"));
    await User.create({ email, password, });
    res.status(200).json({ message: 'Successfully registered' });
}))

router.post('/login', isLoginedUser, catchAsyncErrors(async(req, res, next) => {
    if (!req.body.email)
        return next(new ErrorHandler(400, "Please provide email"));
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