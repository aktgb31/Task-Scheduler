const passport = require("passport");
const Strategy = require("passport-local");
const catchAsyncErrors = require("./middlewares/catchAsyncErrors");
const User = require("./models/user");

passport.use(new Strategy({
    usernameField: "email",
    passwordField: "password"
}, catchAsyncErrors(async(username, password, done) => {
    const user = await User.findOne({ where: { email: username }, raw: true });
    if (!user)
        return done(null, false, { message: "Incorrect username" });
    if (user.password != password)
        return done(null, false, { message: "Incorrect password" });
    return done(null, user);
})));

passport.serializeUser((user, done) => {
    done(null, { id: user.id, email: user.email });
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;