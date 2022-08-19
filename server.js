const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

//npm i express morgan nodemon body-parser dotenv mongoose to install dependencies
dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 8080;


// log any requests
app.use(morgan("tiny"));

// Using body-parser
app.use(bodyParser.urlencoded({extended:true}));

// View engine
//app.set("view engine", "html"); we're using html for that right?
//app.set("views", path.resolve(__dirname, "views"));

// assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

app.get('/', (req, res) => {
    res.send("Crud app");
});

app.listen(PORT, ()=> {console.log(`Server is running on http://localhost:${PORT}`)});