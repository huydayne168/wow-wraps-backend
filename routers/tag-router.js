const express = require("express");

const router = express.Router();
const tagController = require("../controllers/tag-controller");

router.get("/get-tags", tagController.getTags);

router.post("/add-tag", tagController.addTag);

module.exports = router;
