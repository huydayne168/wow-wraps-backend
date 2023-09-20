const express = require("express");

const router = express.Router();
const tagController = require("../controllers/tag-controller");
const { verify } = require("jsonwebtoken");
const { verifyJWT } = require("../middlewares/verifyJWT");

router.get("/get-tags", verifyJWT, tagController.getTags);

router.post("/add-tag", verifyJWT, tagController.addTag);

module.exports = router;
