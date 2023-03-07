const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports.askPermission = (req, res, next) => {
  res.render("users/askPermission");
};

module.exports.create = (req, res, next) => {
  res.render("register");
};

module.exports.doCreate = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("register", { errors, user: req.body });
  }

  delete req.body.role;
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log("user encontrado", user);
      if (user) {
        renderWithErrors({ email: "email already registered" });
      } else {
        console.log("user no existe, creando", req.body);
        return User.create(req.body).then(() => {
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

module.exports.showProfile = (req, res, next) => {
  res.render("users/profile", { user: req.user });
};

module.exports.showEditProfile = (req, res, next) => {
  res.render("users/editProfile", { user: req.user });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, lastName, email, password, diagnosis } = req.body;
  const profilePic = req.file ? req.file.path : req.user.profilePic;
  const data = req.file
    ? { profilePic }
    : { name, lastName, email, password, diagnosis };

  Object.assign(req.user, data);

  req.user
    .save()
    .then(() => {
      res.redirect("/profile");
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  res.render("login");
};

module.exports.doLogin = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render("login", { errors, user: req.body });
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((ok) => {
            if (ok) {
              req.session.userId = user.id;
              res.redirect("/chat");
            } else {
              renderWithErrors({ password: "Password does not match" });
            }
          })
          .catch(next);
      } else {
        renderWithErrors({
          email: "Email not registered",
          password: "An existing email is required",
        });
      }
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Error destroying session: ", error);
    } else {
      res.redirect("/");
    }
  });
};
