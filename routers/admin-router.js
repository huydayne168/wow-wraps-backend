const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const adminController = require("../controllers/admin-controller");
// post sign up admin account:
router.post(
    "/sign-up",
    [
        body("userName", "Please enter your username!").notEmpty(),
        body("password", "Your password must has more than 8 characters!")
            .notEmpty()
            .isLength({ min: 8 }),
        body("email", "Your email is not valid").notEmpty().isEmail(),
        body("phoneNumber", "Please enter your phone number").notEmpty(),
        body("secretKey", "Please enter the secret key").notEmpty(),
    ],
    adminController.postSignup
);

module.exports = router;
