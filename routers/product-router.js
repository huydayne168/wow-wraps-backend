const express = require("express");

const router = express.Router();

const verifyRoles = require("../middlewares/verifyRoles");

const ROLES_LIST = require("../configs/roles-list");

const productController = require("../controllers/product-controller");
const { verifyJWT } = require("../middlewares/verifyJWT");

// router to add a new product:
router.post(
    "/add-product",
    verifyJWT,
    verifyRoles("admin"),
    productController.addNewProduct
);

//  router to get all products:
router.get("/get-products", productController.getProducts);

// router to delete a product:
router.delete(
    "/delete-product",
    verifyJWT,
    verifyRoles("admin"),
    productController.deleteProduct
);

// route to edit an product:
router.patch(
    "/edit-product",
    verifyJWT,
    verifyRoles("admin"),
    productController.editProduct
);

// route to get related products:
router.get("/related-products", productController.getRelatedProducts);

// route to let user add a review:
router.post(
    "/add-review",
    verifyJWT,
    verifyRoles("user"),
    productController.addReview
);

// route to get a product's reviews:
router.get("/get-reviews", productController.getReviews);

module.exports = router;
