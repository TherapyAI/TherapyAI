const express = require("express");
const router = express.Router();
const common = require("../controllers/common.controller");
const session = require("../controllers/chat.controller");

router.get("/", common.home);
router.post("/chat", session.chat);

module.exports = router;
