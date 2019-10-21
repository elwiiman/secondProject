const express = require("express");
const router = express.Router();
const { isAuth, checkRole } = require("../helpers/middlewaresAuth");
const uploader = require("../helpers/multer");
const Tatoo = require("../models/Tatoo");

options = {
  currency: ["MXN", "USD"],
  exec_time: [1, 1.5, 2, 2.5, 3],
  size: ["1 - 5 cm", "6 - 10 cm", "11 - 20 cm", "21 - 30 cm", "+30 cm"]
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

  const {
    name,
    price: value,
    currency,
    description,
    exec_time,
    size
  } = req.body;
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
      exec_time,
      size
    };

    Tatoo.create(tatoo)
      .then(newtatoo => {
        res.redirect("/profile");
      })
      .catch(error => {
        console.log(error);
        res.render("newTatoo", {
          title: "New Tatoo",
          user,
          error
        });
      });
  }
});

//EDIT ROUTES
router.get("/edit/:id", isAuth, (req, res) => {
  const { user } = req;
  const { id } = req.params;
  Tatoo.findById(id)
    .then(tatoo => {
      res.render("editTatoo", { title: "Edit Tatoo", tatoo, options, user });
    })
    .catch(err => console.log(err));
});

router.post("/edit/:id", isAuth, uploader.single("image"), (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const {
    user: { _id: authorArtist }
  } = req;

  const {
    name,
    price: value,
    currency,
    description,
    exec_time,
    size
  } = req.body;
  let image;

  if (!name || !value || !description) {
    let errorMessage = "Required fields should be filled";
    Tatoo.findById(id).then(tatoo => {
      return res.render("editTatoo", {
        title: "Edit Tatoo",
        tatoo,
        user,
        errorMessage
      });
    });
  } else {
    if (!req.file) {
      Tatoo.findById(id, "image")
        .then(tatooImage => {
          image = tatooImage.image;
          let tatoo = {
            authorArtist,
            price: { value, currency },
            name,
            description,
            image,
            exec_time,
            size
          };

          Tatoo.findByIdAndUpdate(id, { $set: tatoo }, { new: true }).then(
            tatoo => {
              res.redirect("/profile");
            }
          );
        })
        .catch(err => console.log(err));
    } else {
      image = req.file.secure_url;
      let tatoo = {
        authorArtist,
        price: { value, currency },
        name,
        description,
        image,
        exec_time
      };

      Tatoo.findByIdAndUpdate(id, { $set: tatoo }, { new: true }).then(
        tatoo => {
          res.redirect("/profile");
        }
      );
    }
  }
});

/// DELETE TATOO ROUTE
router.get("/delete/:id", isAuth, (req, res) => {
  const { id } = req.params;
  console.log("this is id", id);
  Tatoo.findByIdAndDelete(id)
    .then(() => {
      console.log("iamhere");
      res.redirect("/profile");
    })
    .catch(err => res.redirect("/profile"));
});

//MORE INFO TATOO ROUTE
router.get("/moreinfo/:id", isAuth, (req, res) => {
  const { id } = req.params;
  const { user } = req;
  Tatoo.findById(id)
    .then(tatoo => {
      res.render("buyTatoo", { title: "Buy tatoo", tatoo, user });
    })
    .catch(err => {
      console.log("err");
    });
});

//BUY TATOO ROUTE
router.post("/buy/:id", isAuth, (req, res) => {
  const { id } = req.params;
  const { user: acquiredBy } = req;
  const { body_part } = req.body;
  const status = "sold";

  console.log(body_part);
  console.log(req.body);

  tatoo = {
    status,
    acquiredBy,
    body_part
  };

  //

  Tatoo.findByIdAndUpdate(id, { $set: tatoo }, { new: true })
    .then(tatoo => {
      console.log("compra efectuada");
      res.redirect("/schedule");
    })
    .catch(err => console.log("err"));
});

module.exports = router;
