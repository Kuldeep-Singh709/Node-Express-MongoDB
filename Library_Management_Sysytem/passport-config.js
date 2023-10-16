

const LocalStrategy = require('passport-local').Strategy;
const User = require("./Models/User"); 

module.exports = function (passport) {
  // Serialize user object to store in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user object from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Configure the Local Strategy for login
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Field name for username (email/username)
        passwordField: 'password', // Field name for password
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });

          if (!user) {
            return done(null, false, { message: 'Incorrect email/username.' });
          }

          if (!user.verifyPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};









// const LocalStrategy = require('passport-local').Strategy;
// const User = require("./Models/User"); // Assuming your User model is defined in user.js

// module.exports = function (passport) {
//   // Serialize user object to store in the session
//   passport.serializeUser((User, done) => {
//     done(null, User.id);
//   });

//   // Deserialize user object from the session
//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, User) => {
//       done(err, User);
//     });
//   });

//   // Configure the Local Strategy for login
//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: 'email', // Field name for username (email/username)
//         passwordField: 'password', // Field name for password
//       },
//       (email, password, done) => {
//         User.findOne({ email: email }, (err, user) => {
//           if (err) {
//             return done(err);
//           }
//           if (!user) {
//             return done(null, false, { message: 'Incorrect email/username.' });
//           }
//           if (!user.verifyPassword(password)) {
//             return done(null, false, { message: 'Incorrect password.' });
//           }
//           return done(null, user);
//         });
//       }
//     )
//   );
// };


