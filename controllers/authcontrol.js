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

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Sengrid', 
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS, 
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.MAILER_USER,
        subject: process.env.MAILER_PASS,
        text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Sengrid', 
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS, 
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Tattoo Shop<veganvita316@gmail.com>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});