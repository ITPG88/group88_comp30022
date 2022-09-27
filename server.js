//npm i express morgan nodemon body-parser dotenv mongoose axios express-validator to install dependencies
//const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')
const path = require("path");
const app = express();
const connectDB = require("./server/database/connection");

//Create your own config.env file
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;


// Passport include
//require("./server/services/passport.js")(passport);

// Get DB connection
connectDB();

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash());

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
app.use(express.json());

// View engine
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(__dirname + "/"));


//ejs engine

app.set('view engine', 'ejs')
app.use('/static', express.static( "static" ))
app.use('/static/css', express.static( "styles" ))
app.use(express.urlencoded({extended : false}))
app.use(methodOverride('_method'));



//ends here

//Passport middleware
//app.use(passport.initialize);
//app.use(passport.session);


// assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));


//All root routes directed by router
/*app.use("/", require("./server/routes/index.js"));
app.use("/admin", require("./server/routes/admin.js"));
app.use("/subject", require("./server/routes/subject.js"));
app.use("/settings", require("./server/routes/settings.js"));*/

app.get('/', (req,res) =>{
  res.render('index')
})
app.use('/student', require('./routes/student'))

app.use('/moderator', require('./routes/moderator'))
// link to our router


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


/*
const mongoose = require("mongoose");
testing stuff
const userID = mongoose.Types.ObjectId('632928b70eaf462946524199');
const testUpdateReq = {
    body: {
        email: "newEmail@yahoo.com.au"
    }
}
testUpdateReq.body.userID = userID;
console.log(testUpdateReq);
require("./server/controller/studentController").updateStudentUser(testUpdateReq)*/


