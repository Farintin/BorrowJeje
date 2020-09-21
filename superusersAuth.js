const passport = require('passport');
const superUsersPassport = new passport.Passport();

const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const { JWT_SECRET } =  require('./config');
const SuperUser = require('./models/superuser.model');




superUsersPassport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // Validate user token
        const superUser = await SuperUser.findById(payload.sub);
        // If invalid user
        if (!superUser) {
            return done(null, false)
        };
        // But If a valid user
        done(null, superUser)
    } catch (err) {
        done(err, false)
    }
}));

// Local strategy
superUsersPassport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Validate user phone number
        const superUser = await SuperUser.findOne({ username: username });
        // If doesn't exist user's phone number
        if (!superUser) {
            return done(null, false)
        };
        // Pin Matches
        const isMatch = await superUser.isValidPassword(password);
        if (!isMatch) {
            return done(null, false)
        };
        done(null, superUser)
    } catch (err) {
        done(err, false)
    }
}));


module.exports = superUsersPassport;

