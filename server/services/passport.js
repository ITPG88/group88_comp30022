const LocalStrategy = require('passport-local').Strategy
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require('../model/user').User;

module.exports = function(passport) {
    passport.use(new LocalStrategy({username: 'username'}, (username, password, done) =>{
        User.findOne({username: username}).
        then(user => {
            if (!user){
                return done(null, false, {message: "User does not exist"});
            }

            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if (err) throw err;

                if (isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Password incorrect"});
                }
            });

        }).
        catch()
        })
    );

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, {
                id: user.id,
                username: user.username,
                picture: user.picture
            });
        });
    });

    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}