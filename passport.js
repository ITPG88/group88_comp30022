const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User, Student } = require("./server/model/user");

// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
  // Use id to serialize user
  done(undefined, user._id);
});

// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((userId, done) => {
  User.findById(userId, { password: 0 }, (err, user) => {
    if (err) {
      return done(err, undefined);
    }
    return done(undefined, user);
  });
});

// Wasn't sure what this was for - Jason
// User.find({}, (err, users) => {
//   if (users.length > 0) return;
//   User.deleteMany({}, {}, (err) => {
//     User.create(
//       { fullname: "John Doe", username: "user", password: "123456" },
//       (err) => {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         console.log("user inserted");
//       }
//     );
//   });
// });

// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
  // Use id to serialize user
  done(undefined, user._id);
});
// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((userId, done) => {
  User.findById(userId, { password: 0 }, (err, user) => {
    if (err) {
      return done(err, undefined);
    }
    return done(undefined, user);
  });
});

// Updated LocalStrategy function
passport.use(
  "local-login",
  new LocalStrategy(async (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(undefined, false, {
          message: "Unknown error has occurred",
        });
      }
      if (!user) {
        return done(undefined, false, {
          message: "Incorrect username or password",
        });
      }
      // Check password
      user.verifyPassword(password, (err, valid) => {
        if (err) {
          return done(undefined, false, {
            message: "Unknown error has occurred",
          });
        }
        if (!valid) {
          return done(undefined, false, {
            message: "Incorrect username or password",
          });
        }
        // If user exists and password matches the hash in the database
        return done(undefined, user);
      });
    });
  })
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }).then((userExists) => {
        if (userExists) return done(null, false, { message: "username taken" });
        var userData = {
          username: username,
          fullname: req.body.fullname,
          email: req.body.email,
          password: password,
        };

        Student.create(userData).then((newUser, created) => {
          if (!newUser) {
            return done(null, false, {
              message: "You are already registered. Please sign in!",
            });
          }
          if (newUser) {
            return done(null, newUser, {
              message: "You are now registered and logged in!",
            });
          }
        });
      });
    }
  )
);

module.exports = passport;
