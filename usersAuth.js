
const passport = require('passport');
const usersPassport = new passport.Passport();

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const { JWT_SECRET } =  require('./config');
const User = require('./models/user.model');




usersPassport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Validate user token
        const user = await User.findById(payload.sub);
        // If invalid user
        if (!user) {
            return done(null, false)
        };
        // But If a valid user
        done(null, user)
    } catch (err) {
        done(err, false)
    }
}));

// Local strategy
usersPassport.use(new LocalStrategy({
    usernameField: 'phoneNo',
    passwordField: 'pin'
}, async (username, password, done) => {
    try {
        // Validate user phone number
        const user = await User.findOne({ phoneNo: username });
        // If doesn't exist user's phone number
        if (!user) {
            return done(null, false)
        };
        // Pin Matches
        const isMatch = await user.isValidPin(password);
        if (!isMatch) {
            return done(null, false)
        };
        done(null, user)
    } catch (err) {
        done(err, false)
    }
}));


module.exports = usersPassport;