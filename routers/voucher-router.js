const express = require("express");

const router = express.Router();

const verifyRoles = require("../middlewares/verifyRoles");

const { body } = require("express-validator");

const { verifyJWT } = require("../middlewares/verifyJWT");

const voucherController = require("../controllers/voucher-controller");

// route to add voucher:
router.post(
    "/add-voucher",
    [
        body("code", "code valid").notEmpty(),
        body("quantity", "Quantity invalid!").notEmpty(),
        body("end", "end time not valid").notEmpty(),
    ],
    verifyJWT,
    verifyRoles("admin"),
    voucherController.addVoucher
);

// route to get vouchers:
router.get(
    "/get-vouchers",
    verifyJWT,
    verifyRoles("admin"),
    voucherController.getVoucher
);

// route to get vouchers:
router.get(
    "/apply-voucher",
    verifyJWT,
    verifyRoles("user"),
    voucherController.applyVoucher
);

// route to delete vouchers:
router.delete(
    "/delete-voucher",
    verifyJWT,
    verifyRoles("admin"),
    voucherController.deleteVoucher
);

module.exports = router;
