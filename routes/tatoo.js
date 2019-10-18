const express = require("express");
const router = express.Router();
const { isAuth } = require("../helpers/middlewaresAuth");
const uploader = require("../helpers/multer");
const Tatoo = require("../models/Tatoo");

router.get("/new", isAuth, (req, res) => {
  const { user } = req;

  res.render("newTatoo", { title: "New Tatoo", create: true, user });
});

router.post("/new", isAuth, uploader.single("image"), (req, res) => {
  const { user } = req;
  const {
    user: { _id: authorArtist }
  } = req;

  const { name, price: value, currency, exec_time, description } = req.body;
  let image = req.file;
  if (!name || !value || !description || !image) {
    let errorMessage = "All fields must be filled";
    return res.render("newTatoo", {
      title: "New Tatoo",
      create: true,
      user,
      errorMessage
    });
  } else {
    image = req.file.secure_url;

    const tatoo = {
      authorArtist,
      price: { value, currency },
      name,
      description,
      image,
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
