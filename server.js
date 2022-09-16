//npm i express morgan nodemon body-parser dotenv mongoose axios to install dependencies

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'))


//Create your own config.env file
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

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

// link to our router
const studentRouter = require('./server/routes/studentRouter')
const moderatorRouter = require('./server/routes/moderatorRouter')

// manage routers
app.use('/student', studentRouter)
app.use('/moderator', moderatorRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
