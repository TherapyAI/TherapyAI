const express = require("express");
const router = express.Router();
const common = require("../controllers/common.controller");
const session = require("../controllers/chat.controller");
const users = require("../controllers/users.controller");
const secure = require("../middlewares/secure.mid");
const multer = require("../config/multer.config");
const notes = require("../controllers/notes.controller")
// const upload = //


router.get("/", common.home);

router.get("/register", users.create);
router.post("/register", users.doCreate);
router.get("/profile", secure.isAuthenticated, users.showProfile);
router.get("/editProfile", secure.isAuthenticated, users.showEditProfile);
router.post("/profile/edit", secure.isAuthenticated, multer.single('profilePic'), users.updateProfile);
router.post("/diagnosis", secure.isAuthenticated, notes.sendNotes);

router.get("/login", users.login);
router.post("/login", users.doLogin);

router.get("/chat", secure.isAuthenticated, secure.checkPatientRole, session.loadChat);
router.post("/chat", secure.isAuthenticated, secure.checkPatientRole, session.sendChat);

router.get("/askPermission", users.askPermission)

router.post("/logout", users.logout);

module.exports = router;
