const passport = require("../helpers/passport");
const User = require("../models/User");
const { send } = require("../helpers/mailer");
const schema = require("../models/User")


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
    return res.render("register", { title: "SignUp", error });
  }

  if (!password || !username || !email || !confirmPass || !role) {
    console.log("some field is blank");
    let error = "All fields must be filled";
    return res.render("register", { title: "SignUp", error });
  }
 
 if(password.length <8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) ||!password.match(/[0-9]/) || !password.match(/(^[a-zA-Z0-9]+$)/i)) {
 console.log("not a valid password"); 
 let error = "Not a valid password";
 return res.render("register", { title: "SignUp", error});
 }


 User.register({ username, email }, password)
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
       return res.render("register", { title: "Sign Up", errorMessage });
     res.redirect("/home");
   });
 })
 .catch(errorMessage =>
   res.render("register", { title: "Sign Up", errorMessage })
 );
};

