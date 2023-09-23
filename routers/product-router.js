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
router.get("/get-products", productController.getProducts);

// router to delete a product:
router.delete(
    "/delete-product",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    productController.deleteProduct
);

// route to edit an product:
router.patch(
    "/edit-product",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    productController.editProduct
);

module.exports = router;
