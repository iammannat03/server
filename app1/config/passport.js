const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // username + password -> server -> session object -> cookie which will be sent to the user
const User = require("./database");
const { compareSync } = require("bcrypt");

passport.use(
  // authenticate user
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function (user, done) {
  // this function is called when the user is authenticated and it is used to store the user id in the session. Persists user data inside session
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  // this function is called when the user is authenticated and it is used to retrieve the user id from the session. Fetches session details using session id
  try {
    const user = User.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
