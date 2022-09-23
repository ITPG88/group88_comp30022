const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const path = require("path");
const app = express();
const connectDB = require("./server/database/connection");


dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

connectDB();