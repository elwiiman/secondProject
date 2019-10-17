const express = require("express");
const router = express.Router();
const { isAuth } = require("../helpers/middlewaresAuth");
const uploader = require("../helpers/multer");
const Tatoo = require("../models/Tatoo");

router.get("/new", isAuth, (req, res) => {
  const { user } = req;

  res.render("newTatoo", { title: "New Tatoo", create: true, user });
});

router.post("/new", isAuth, uploader.array("images"), (req, res) => {
  const { user } = req;
  const {
    user: { _id: authorArtist }
  } = req;

  const { name, price: value, currency, exec_time, description } = req.body;
  let images = req.files;
  if (!name || !value || !description || !images) {
    let errorMessage = "All fields must be filled";
    return res.render("newTatoo", {
      title: "New Tatoo",
      create: true,
      user,
      errorMessage
    });
  } else {
    images = req.files.map(file => file.secure_url);

    const tatoo = {
      authorArtist,
      price: { value, currency },
      name,
      description,
      images,
      exec_time
    };

    console.log(tatoo);

    Tatoo.create(tatoo)
      .then(newtatoo => {
        res.redirect("/profile");
      })
      .catch(error => {
        res.render("newTatoo", {
          title: "New Tatoo",
          create: true,
          user,
          error
        });
      });
  }
});

module.exports = router;
