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
  if(password) {
    function isStrongPwd2(password) {
 
      var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
      var lowercase = "abcdefghijklmnopqrstuvwxyz";
  
      var digits = "0123456789";
  
      var splChars ="!@#$%&*()";
  
      var ucaseFlag = contains(password, uppercase);
  
      var lcaseFlag = contains(password, lowercase);
  
      var digitsFlag = contains(password, digits);
  
      var splCharsFlag = contains(password, splChars);
  
      if(password.length>=8 && ucaseFlag && lcaseFlag && digitsFlag && splCharsFlag)
            return true;
      else
            return false;
    }
  }
  User.register({ username, email, role }, password)
    .then(usr => {
      ///LINES FOR MAILING - TO CONFIRM ACCOUNT
       const options = {
         filename: "registration",
         email: usr.email,
         message: "Valida tu correo",
         subject: "Confirma correo"
       };
       send(options);
      req.login(usr, errorMessage => {
        if (errorMessage) return res.render("registration", { title: "SignUp", errorMessage });
        res.redirect("/home");
      });
    })
    .catch(errorMessage => res.render("registration", { title: "SignUp", errorMessage }));
};
