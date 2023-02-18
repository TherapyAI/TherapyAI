const express = require("express");
const router = express.Router();
const common = require("../controllers/common.controller");
const session = require("../controllers/chat.controller");
const users = require("../controllers/users.controller");
const secure = require('../middlewares/secure.mid');

router.get("/", common.home);

router.get("/register", users.create);
router.post("/register", users.doCreate);

router.get("/login", users.login);
router.post("/login", users.doLogin);

router.get("/chat", secure.isAuthenticated, session.loadChat);
router.post("/chat", secure.isAuthenticated, session.sendChat);

module.exports = router;
