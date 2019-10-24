const express = require("express");
const router = express.Router();
const { isAuth } = require("../helpers/middlewaresAuth");
const { formatDate } = require("../helpers/formatDataTime");
const Tatoo = require("../models/Tatoo");
const Event = require("../models/Event");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

/* GET home page */
router.get("/", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("index", { user });
});

router.get("/home", isAuth, (req, res, next) => {
  const { user } = req;
  res.render("home", { title: "Home", user });
});

router.get("/profile/home", isAuth, (req, res, next) => {
  const { user } = req;
  let help = {};
  help.formatDate = formatDate;

  if (user.role === "artist") {
    console.log("you are an artist");
    Tatoo.find({ authorArtist: user._id, status: "for sale" }).then(tatoos => {
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

router.get("/profile/myevents", isAuth, (req, res) => {
  const { user } = req;

  if (user.role === "artist") {
    User.find({ username: user.username })
      .then(usuario => {
        console.log(usuario[0]._id);
        Event.find(
          { seller: ObjectId(usuario[0]._id) },
          { title: 1, start: 1, end: 1, _id: 0 }
        )
          .then(myevents => {
            console.log(myevents);
            res.render("calendar", {
              title: "My Events",
              eventsRender: JSON.stringify(myevents),
              user
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  if (user.role === "fan") {
    User.find({ username: user.username })
      .then(usuario => {
        console.log(usuario[0]._id);
        Event.find(
          { client: ObjectId(usuario[0]._id) },
          { title: 1, start: 1, end: 1, _id: 0 }
        )
          .then(myevents => {
            console.log(myevents);
            res.render("calendar", {
              title: "My Events",
              eventsRender: JSON.stringify(myevents),
              user
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }



});

module.exports = router;
