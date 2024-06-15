const express = require("express");
const app = express();
const User = require("./config/database");
const { hashSync } = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

require("./config/passport");

// middlewares;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "i am a good girl",
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/passport",
      collectionName: "sessions",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // the session will last for 1 week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// get routes
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// post routes
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/login",
  })
);
app.post("/register", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });
  await user
    .save()
    .then((user) => console.log(user))
    .catch((err) => console.log("error: ", err.message));

  res.send({ message: "success" });
});

// logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/protected");
  });
});

// protected route
app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ message: "you are Authenticated" });
  } else {
    res.status(401).send({ message: "you are not authenticated" });
  }
  console.log(req.session);
  console.log(req.user);
});

// listen to port
app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
