const express = require("express");

const router = express.Router();

const verifyRoles = require("../middlewares/verifyRoles");

const { body } = require("express-validator");

const flashSaleController = require("../controllers/flashSale-controller");

const { verifyJWT } = require("../middlewares/verifyJWT");

// add fs route:
router.post(
    "/add-fs",
    [
        body("name", "name valid").notEmpty(), // check if email is not empty and it is a valid email
        body("discountPercent", "discount percent invalid!").notEmpty(),

        body("start", "start time not valid!").notEmpty(),
        body("end", "end time not valid").notEmpty(),
    ],
    verifyJWT,
    verifyRoles("admin"),
    flashSaleController.addFlashSale
);

// get flash sales route:
router.get(
    "/get-fss",
    verifyJWT,
    verifyRoles("admin"),
    flashSaleController.getFlashSales
);

// route to delete flash sale:
router.delete(
    "/delete-fs",
    verifyJWT,
    verifyRoles("admin"),
    flashSaleController.deleteFlashSale
);

module.exports = router;
