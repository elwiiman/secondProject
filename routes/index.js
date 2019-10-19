const express = require("express");
const router = express.Router();
const { isAuth } = require("../helpers/middlewaresAuth");
const { formatDate } = require("../helpers/formatDataTime");
const Tatoo = require("../models/Tatoo");

/* GET home page */
router.get("/", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("index", { user });
});

router.get("/home", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("home", { title: "Home", user });
});

router.get("/profile", isAuth, (req, res, next) => {
  const { user } = req;
  let help = {};
  help.formatDate = formatDate;

  if (user.role === "artist") {
    console.log("you are an artist");
    Tatoo.find({ authorArtist: user._id }).then(tatoos => {
      res.render("profile-artist", { title: "Profile", user, tatoos, help });
    });
  }

  if (user.role === "fan") {
    console.log("you are a fan");
    Tatoo.find({ status: "for sale" })
      .populate("authorArtist", "username")
      .then(tatoos => {
        res.render("profile-fan", { title: "Profile", user, tatoos, help });
      });
  }
});

module.exports = router;
