const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

//npm i express morgan nodemon body-parser dotenv mongoose to install dependencies
dotenv.config({path: 'config.env'});
const PORT = process.env.PORT || 8080;


// log any requests
app.use(morgan("tiny"));

// Using body-parser
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.send("Crud app");
});

app.listen(PORT, ()=> {console.log(`Server is running on http://localhost:${PORT}`)});