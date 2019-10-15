const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("../helpers/passport");
const { toProfile } = require("../helpers/middlewaresAuth");

router.get("/signup", toProfile, (req, res) => {
  res.render("signup", { title: "SignUp" });
});

router.post("/signup", toProfile, (req, res) => {
  const { username, email, password, confirmPass } = req.body;

  if (password !== confirmPass) {
    console.log("pass not the same");
    let error = "Make sure enter same passwords in both fields";
    return res.render("signup", { title: "SignUp", error });
  }

  if (!password || !username || !email || !confirmPass) {
    console.log("some field is blank");
    let error = "All fields must be filled";
    return res.render("signup", { title: "SignUp", error });
  }

  User.register({ username, email }, password)
    .then(usr => {
      ///LINES FOR MAILING - TO CONFIRM ACCOUNT
      // const options = {
      //   filename: "register",
      //   email: usr.email,
      //   message: "Valida tu correo",
      //   subject: "Confirma correo"
      // };
      // send(options);
      req.login(usr, error => {
        if (error) return res.render("signup", { title: "SignUp", error });
        res.redirect("/home");
      });
    })
    .catch(error => res.render("signup", { title: "SignUp", error }));
});

router.get("/login", toProfile, (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", toProfile, (req, res) => {
  passport.authenticate("local", (err, user, info = {}) => {
    const { message: error } = info;
    if (error) {
      return res.render("login", { error });
    }

    req.login(user, err => {
      res.redirect("/profile");
    });
  })(req, res);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
