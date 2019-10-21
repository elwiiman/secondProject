const passport = require("../helpers/passport");
const User = require("../models/User");
const { send } = require("../helpers/mailer");

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
  let { username, email, password, confirmPass, role } = req.body;

  if (password !== confirmPass) {
    console.log("pass not the same");
    let error = "Make sure enter same passwords in both fields";
    return res.render("register", { title: "SignUp", error });
  }

  if (!password || !username || !email || !confirmPass || !role) {
    console.log("some field is blank");
    let error = "All fields must be filled";
    return res.render("register", { title: "SignUp", error });
  }
 
    


  User.register({ username, email,role }, password)
    .then(usr => {
      const options = {
        filename: "register",
        email: usr.email,
        message: "Valida tu correo",
        subject: "Confirma correo"
      };
      send(options);
      req.login(usr, errorMessage => {
        if (errorMessage)
          return res.render("register", { title: "Signup", errorMessage });
        res.redirect("/home");
      });
    })
    .catch(errorMessage =>
      res.render("register", { title: "Sign Up", errorMessage })
    );
};
