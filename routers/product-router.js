const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const verifyRoles = require("../middlewares/verifyRoles");

const ROLES_LIST = require("../configs/roles-list");

const productController = require("../controllers/product-controller");
const { verifyJWT } = require("../middlewares/verifyJWT");

// router to add a new product:
router.post(
    "/add-product",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    productController.addNewProduct
);

//  router to get all products:
router.get("/get-all-products", productController.getAllProducts);

module.exports = router;
