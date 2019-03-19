const jwtStrategy = require('passport-jwt').Strategy;
const jwtExtract = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Keys = require('./keys');

let opts = {};
opts.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Keys.secretOrKey;

const Passport = () => {
    Passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then((user) => {
                    if (user) {
                        return done(null, user)
                    }

                    return done(null, false);
                })
                .catch((err) => console.log(err));
        })
    )
}

module.exports = { Passport };