const express = require("express");

const router = express.Router();

const verifyRoles = require("../middlewares/verifyRoles");

const { body } = require("express-validator");
const productController = require("../controllers/product-controller");
const { verifyJWT } = require("../middlewares/verifyJWT");

// router to add a new product:
router.post(
    "/add-product",
    [
        body("name", "Name Invalid!").notEmpty(),
        body("category", "Category Invalid").notEmpty(),
        body("amount", "Amount Invalid").notEmpty(),
        body("price", "Price Invalid").notEmpty(),
        body("shortDescription", "shortDescription Invalid").notEmpty(),
        body("longDescription", "longDescription Invalid").notEmpty(),
        body("tags", "Tags Invalid").notEmpty(),
        body("image", "Image Invalid").notEmpty(),
    ],
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
    [
        body("name", "Name Invalid!").notEmpty(),
        body("category", "Category Invalid").notEmpty(),
        body("amount", "Amount Invalid").notEmpty(),
        body("price", "Price Invalid").notEmpty(),
        body("shortDescription", "shortDescription Invalid").notEmpty(),
        body("longDescription", "longDescription Invalid").notEmpty(),
        body("tags", "Tags Invalid").notEmpty(),
        body("image", "Image Invalid").notEmpty(),
    ],
    verifyJWT,
    verifyRoles("admin"),
    productController.editProduct
);

// route to get related products:
router.get("/related-products", productController.getRelatedProducts);

// route to let user add a review:
router.post(
    "/add-review",
    [
        body("productId", "productId Invalid!").notEmpty(),
        body("comment", "comment Invalid").notEmpty(),
        body("ratePoint", "ratePoint Invalid").notEmpty(),
        body("date", "date Invalid").notEmpty(),
        body("userId", "userId Invalid").notEmpty(),
    ],
    verifyJWT,
    verifyRoles("user"),
    productController.addReview
);

// route to get a product's reviews:
router.get("/get-reviews", productController.getReviews);

module.exports = router;
