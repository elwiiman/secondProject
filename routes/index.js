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
  Tatoo.find({ authorArtist: user._id }).then(tatoos => {
    res.render("profile", { title: "Profile", user, tatoos, help });
  });

  router.get("/card", isAuth, (req, res, next) => {
    const { user } = req;
    res.render("pruebaCard", { user });
  });
});

module.exports = router;
