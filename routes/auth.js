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

const result={};

result.loginTokenGet = (req, res) => {
   
  User.findOne({ resetPasswordToken: req.params.token},(err, user) => {
    if (!user) {
       return res.redirect('/forgot');
    } else {
         console.log("successfully Logged In");
        res.redirect('/login');
    }
  });
}

result.loginTokenPost = (req, res) => {

  User.findOne({ resetPasswordToken: req.params.token}, function(err, user) {
      if (!user) {
        res.json('You are not valid user');
        res.redirect('/Signup');
      } else {
        res.json("you are successfully logged In...")
      }
    });
}

result.signUpGet = (req, res) => {
    //console.log("req : " , req);
    res.render('signup', {
      user: req.user
       //console.log("user : " ,user)
    });
}

result.signUpPost = (req, res, next) => {
//console.log("@BODY--", req.body);
var arr = [];

async.waterfall([
  function(done) {
    crypto.randomBytes(20, (err, buf) => {
      var token = buf.toString('hex');
      done(err, token);
    });
  },
  function(token, done) {
   var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
   //push user data into array
    arr.push(user)

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.save((err) => {
        done(err, token, user);
      });

  },
  function(token, user, done) {

      var email = new sendgrid.Email({
          to: user.email,
          from: 'your email address',
          subject: 'Signup Varification',
          html: 'Signup Varification.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          '<a href="http://' + req.headers.host + '/login/' + token + '">Varify your Account</a>\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
     // html: '<b> varify your email?</b>'
       });

      sendgrid.send(email, (err, json) => {

          if(err) { return console.error(err); }
          console.log(json);
          done(err, 'done');
      });

  }
], function(err) {
  if (err) {
     res.redirect('/signup');
    return next(err);
 }
  else{
    //console.log("arr" , arr)
    //res.json({success:true,message:"sucessfully created...",data:arr});
    res.redirect('/login');
  }
});
}

module.exports = router;
