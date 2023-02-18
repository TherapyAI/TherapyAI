const express = require("express");
const router = express.Router();
const common = require("../controllers/common.controller");
const session = require("../controllers/chat.controller");

router.get("/", common.home);
router.get("/chat", session.loadChat);
router.post("/chat", session.sendChat);

module.exports = router;
