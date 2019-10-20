const passport = require("../helpers/passport");
const User = require("../models/User");

exports.login = (req, res) => {
  passport.authenticate("local", (err, user, info = {}) => {
    const { message: error } = info;
    if (error) {
      return res.render("login", { error });
    }

    req.login(user, err => {
      res.redirect("/profile");
    });
  })(req, res);
};

exports.signup = (req, res) => {
  const { username, email, password, confirmPass, role } = req.body;

  if (password !== confirmPass) {
    console.log("pass not the same");
    let error = "Make sure enter same passwords in both fields";
    return res.render("signup", { title: "SignUp", error });
  }

  if (!password || !username || !email || !confirmPass || !role) {
    console.log("some field is blank");
    let error = "All fields must be filled";
    return res.render("signup", { title: "SignUp", error });
  }

  User.register({ username, email, role }, password)
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
        res.redirect("/profile");
      });
    })
    .catch(error => res.render("signup", { title: "SignUp", error }));
};
