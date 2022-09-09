const express = require("express");

// create Router object
const router = express.Router();
// import controller functions
const loginController = require("../controller/loginController");

// Login page (with failure message displayed upon login failure)
// router.get("/login", (req, res) => {
//   res.render("Login", { flash: req.flash("error"), title: "Login" });
// });

// add a route to handle the GET request for student homepage
router.get("/:patient_id", studentController.getCurrentStudent);

// Some initial routing
router.get("/", loginController.landing);
router.get("/signup", loginController.signup);
module.exports = router;
