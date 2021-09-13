const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  res.render("mainpage");
});

router.get("/users/login", (req, res) => {
  res.render("login");
});

router.get("/users/register", (req, res) => {
  res.render("register");
});

router.post("/users/register", (req, res) => {
  const { name, email, password, password2, person } = req.body;
  User.findOne({ name: name })
    .then((op) => {
      let errors = [];
      if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all the fields" });
      }

      if (person === "role") {
        errors.push({ msg: "Please choose a role" });
      }

      if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
      }

      if (password.lenth < 4) {
        errors.push({ msg: "Password is too short" });
      }

      if (errors.length > 0) {
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          person,
        });
      } else if (!op === false) {
        errors.push({ msg: "Username is already in use" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
          person,
        });
      } else {
        User.findOne({ email: email }).then((user) => {
          if (user) {
            errors.push({ msg: "Email already exists" });
            res.render("register", {
              errors,
              name,
              email,
              password,
              password2,
              person,
            });
          } else {
            const newUser = new User({
              name,
              email,
              password,
              person,
            });

            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    req.flash(
                      "success_msg",
                      "You are registered and can now login"
                    );
                    res.redirect("/users/login");
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/users/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/classroom",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
