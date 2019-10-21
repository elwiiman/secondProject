const express = require("express");
const router = express.Router();
const { toProfile } = require("../helpers/middlewaresAuth");
const authcontrollers = require("../controllers/authcontrol");

router.get("/signup", toProfile, (req, res) => {
  res.render("register", { title: "Signup" });
});

router.post("/signup", toProfile, authcontrollers.signup);

router.get("/login", toProfile, (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", toProfile, authcontrollers.login);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
