const express = require("express");
const router = express.Router();
const { isAuth } = require("../helpers/middlewaresAuth");
const uploader = require("../helpers/multer");
const Tatoo = require("../models/Tatoo");

options = {
  currency: ["MXN", "USD"],
  exec_time: [1, 1.5, 2, 2.5, 3]
};

///NEW TATOO ROUTES
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

//EDIT ROUTES
router.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  Tatoo.findById(id)
    .then(tatoo => {
      res.render("editTatoo", { title: "Edit Tatoo", tatoo, options });
    })
    .catch(err => console.log(err));
});

/// DELETE TATOO ROUTE
router.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  console.log("this is id", id);
  Tatoo.findByIdAndDelete(id)
    .then(() => {
      console.log("iamhere");
      res.redirect("/profile");
    })
    .catch(err => res.redirect("/profile"));
});

module.exports = router;
