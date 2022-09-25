const LocalStrategy = require('passport-local').Strategy
const mongoose = require("mongoose");
const passport = require('passport');
const User = require('../model/user').User;

module.exports = function(passport) {
    passport.use(new LocalStrategy({username: 'username'}, async(username, password, done) =>{
        await User.findOne({username: username}).
        then(user => {
            if (!user){
                return done(null, false, {message: "User does not exist"});
            }

            user.verifyPassword(password, (err, isMatch) =>{
                if (err) throw err;

                if (isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Password incorrect"});
                }
            });

        }).
        catch(err => {
            console.log(err);
        })
    }));

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, {
                _id: user.id,
                username: user.username,
                fullName: user.fullName,
                type: user.type
            });
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}