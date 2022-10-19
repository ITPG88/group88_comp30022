// nodemon server2.js
const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const app = express();
const connectDB = require("./server/database/connection");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

require("./server/services/passport")(passport);
connectDB();

app.use(flash());

//to enable cors
app.use(cors());

// Global vars
/*
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.local.error_msg = req.flash('error_msg');
    next();
})*/
app.enable("trust proxy");
// Session
app.use(
  session({
    // The secret used to sign session cookies (ADD ENV VAR)
    secret: process.env.SESSION_SECRET || "keyboard cat",
    name: "user", // The cookie name (CHANGE THIS)
    saveUninitialized: true,
    resave: false,
    proxy: true,
    cookie: {
      sameSite: "strict",
      httpOnly: true,
      secure: "auto",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Express session and flash
app.use(express.json());

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(__dirname + "/"));
app.use(methodOverride("_method"));
app.use("/static", express.static("static"));
app.use("/static/css", express.static("styles"));

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//Morgan for development
app.use(morgan("tiny"));

// Routes
app.use("/", require("./server/routes/index"));
app.use("/settings", require("./server/routes/settings"));
app.use("/subject", require("./server/routes/subject"));


//routes which handles the requests
app.all("*", (req, res) => {
  res.redirect("/error404");
});
// Error 404 not found
app.all("*", (req, res) => {
  // 'default' route to catch user errors
  res
    .status(404)
    .render("error", { errorCode: "404", message: "That route is invalid." });
  //res.send('error')
});

// Listen on port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
