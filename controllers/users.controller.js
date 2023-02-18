const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports.create = (req, res, next) => {
  res.render("register");
};

module.exports.doCreate = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("register", { errors, user: req.body });
  }

  console.log("creando user...");

  delete req.body.role;
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log("user encontrado", user);
      if (user) {
        console.log("user ya existe");
        renderWithErrors({ email: "email already registered" });
      } else {
        console.log("user no existe, creando", req.body);
        return User.create(req.body).then(() => {
          console.log("algo");
          res.redirect("/login");
        });
      }
    })
    .catch((error) => {
      console.log("error creando!", error);
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors);
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res) => {
  res.render("login");
};

const sessions = {};

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((ok) => {
          if (ok) {
            req.session.userId = user.id;
            res.redirect("/chat");
          }
        })
        .catch(next);
    })
    .catch(next);
};
