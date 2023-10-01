const express = require("express");

const router = express.Router();

const { body } = require("express-validator");
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");

const checkoutController = require("../controllers/checkout-controller");

// route to add checkout:
router.post(
    "/add-checkout",
    verifyJWT,
    verifyRoles("user"),
    checkoutController.addCheckout
);

// route to get checkouts:
router.get(
    "/get-checkouts",
    verifyJWT,
    verifyRoles("admin"),
    checkoutController.getCheckouts
);

// route to update checkout status:
router.post(
    "/update-checkout",
    verifyJWT,
    verifyRoles("admin"),
    checkoutController.updateCheckout
);

// route to delete checkout:
router.delete(
    "/delete-checkout",
    verifyJWT,
    verifyRoles("admin"),
    checkoutController.deleteCheckout
);

module.exports = router;
