//npm i express morgan nodemon body-parser dotenv mongoose axios to install dependencies

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const app = express();
const connectDB = require("./db");
//Create your own config.env file
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash());
connectDB();
// Track authenticated users through login sessions
app.use(
  session({
    // The secret used to sign session cookies (ADD ENV VAR)
    secret: process.env.SESSION_SECRET || "keyboard cat",
    name: "demo", // The cookie name (CHANGE THIS)
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: "strict",
      httpOnly: true,
      secure: app.get("env") === "production",
    },
  })
);

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // Trust first proxy
}

// Initialise Passport.js
const passport = require("./passport");
app.use(passport.authenticate("session"));

// log any requests
app.use(morgan("tiny"));

// Using body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(__dirname + "/"));

// assets
// app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
// app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
// app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

//All root routes directed by router
app.use("/", require("./server/routes/index.js"));
app.use("/admin", require("./server/routes/admin.js"));
app.use("/subject", require("./server/routes/subject.js"));
app.use("/settings", require("./server/routes/settings.js"));

// link to our router

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
