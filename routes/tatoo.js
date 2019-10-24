const express = require("express");
const router = express.Router();
const { isAuth, checkRole } = require("../helpers/middlewaresAuth");
const uploader = require("../helpers/multer");
const Tatoo = require("../models/Tatoo");
const Event = require("../models/Event");

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
        res.redirect("/profile/home");
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
              res.redirect("/profile/home");
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
          res.redirect("/profile/home");
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
      res.redirect("/profile/home");
    })
    .catch(err => res.redirect("/profile/home"));
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

  Tatoo.findByIdAndUpdate(id, { $set: tatoo }, { new: true })
    .then(tatoo => {
      console.log("compra efectuada");
      res.redirect(`/tatoo/appointment/${id}`);
    })
    .catch(err => console.log("err"));
});

router.get("/appointment/:id", isAuth, (req, res) => {
  const { id } = req.params;
  const { user } = req;
  console.log("here i am", id);
  //You have an appointment with:

  Tatoo.findById(id, { image: 0, description: 0, price: 0, status: 0 })
    .then(tatoo => {
      console.log(tatoo);
      res.render("appointment", { title: "Appointment", user, tatoo });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/appointment/:id", isAuth, (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const {
    client_phone_number,
    firstTime,
    startDateHour,
    duration,
    seller,
    client,
    tatoo_size,
    body_part
  } = req.body;

  if (!startDateHour || !client_phone_number || !firstTime) {
    let errorMessage = "All fields must be filled";
    Tatoo.findById(id, { image: 0, description: 0, price: 0, status: 0 })
      .then(tatoo => {
        console.log(tatoo);
        return res.render("appointment", {
          title: "Appointment",
          user,
          errorMessage,
          tatoo
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  let start = startDateHour.split(" ")[0];
  let startTime = startDateHour.split(" ")[1];

  start = start + "T" + startTime + ":00Z";

  start = new Date(start);
  const startMillis = start.getTime();
  console.log(start);
  start = start.toISOString();

  console.log(start);

  let end = startMillis + (duration * 3600000);
  end = new Date(end);
  end = end.toISOString();

  console.log("start", start, "end", end);

  Tatoo.findById(id)
    .then(tatoo => {
      const event = {
        title: tatoo.name,
        start,
        end,
        duration,
        seller,
        client,
        tatoo_size,
        body_part,
        tatoo: tatoo._id,
        client_phone_number,
        firstTime
      };
      Event.create(event)
        .then(event => {
          res.redirect("/profile/myevents");
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

  //2019-10-22T06:30:00Z
});

module.exports = router;
