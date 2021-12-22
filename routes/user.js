const passport = require('../passport');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const { isLoginedUser, isAuthenticatedUser } = require('../middlewares/auth');
const ErrorHandler = require('../utils/errorHandler');

const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userName
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         userName:
 *           type: string
 *           description: The unique user name of the user
 *         password:
 *           type: string
 *           description: The password of the user
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User related API
 */


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/User'
 *     responses:
 *      '200':
 *          description: Successfully registered
 *      '400':
 *          description: Error in Message
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

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Logins a registered user
 *     tags: [User]
 *     description: Logins a registered user
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema: 
 *                  $ref: '#/components/schemas/User'
 *     responses:
 *      '200':
 *          description: Successfully Logged in
 *      '400':
 *          description: Error in Message
 *       
 */

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

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logouts a logged in user
 *     tags: [User]
 *     description: Logouts a logged in user
 *     responses:
 *      '200':
 *          description: Successfully Logged in
 *      '400':
 *          description: Error in Message
 *       
 */
router.post('/logout', isAuthenticatedUser, catchAsyncErrors(async(req, res, next) => {
    req.logOut();
    res.status(200).json({ message: 'Successfully logged out' });
}));

module.exports = router;