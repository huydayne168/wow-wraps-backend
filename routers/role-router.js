const express = require("express");

const router = express.Router();

const roleController = require("../controllers/role-controller");

router.get("/get-roles", roleController.getRoles);

router.post("/add-role", roleController.addRole);

router.patch("/edit-role", roleController.editRole);

module.exports = router;
