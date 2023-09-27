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
    verifyRoles(ROLES_LIST.user),
    checkoutController.addCheckout
);

module.exports = router;
