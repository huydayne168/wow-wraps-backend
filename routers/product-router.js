const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const verifyRoles = require("../middlewares/verifyRoles");

const ROLES_LIST = require("../configs/roles-list");

const productController = require("../controllers/product-controller");

// router to add a new product:
router.post("/add-product", productController.addNewProduct);

module.exports = router;
