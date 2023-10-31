const express = require("express");
const router = express.Router();
const chatControllers = require("../controllers/chat");
const { verifyJWT } = require("../middlewares/verifyJWT");

router.post("/createRoom", verifyJWT, chatControllers.createRoom);

router.get("/getRoom", verifyJWT, chatControllers.getRoom);

router.get("/getMessage", verifyJWT, chatControllers.getMessage);

router.post("/sendMessage", verifyJWT, chatControllers.sendMessage);

module.exports = router;
