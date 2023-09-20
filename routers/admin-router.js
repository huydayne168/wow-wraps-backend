const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const adminController = require("../controllers/admin-controller");
const { loginHandler } = require("../controllers/login-controller");
const { getAnUser } = require("../controllers/user-controller");
const { logoutController } = require("../controllers/logout-controller");
// post sign up admin account:
router.post(
    "/sign-up",
    [
        body("userName", "Please enter your username!").notEmpty(),
        body("password", "Your password must has more than 8 characters!")
            .notEmpty()
            .isLength({ min: 8 }),
        body("email", "Your email is not valid").notEmpty().isEmail(), // check if email is not empty and it is a valid email
        body("phoneNumber")
            .notEmpty()
            .withMessage("Please enter your phone number")
            .isMobilePhone(["vi-VN", "en-US"])
            .withMessage("This phone number is not valid!")

            .isLength({ min: 10 }), // check phone number is not empty and the length is more than 10 numbers
        body("secretKey", "Please enter the secret key").notEmpty(), // check secret key is not empty
    ],
    adminController.postSignup
);

router.post(
    "/login",
    [
        body("email", "Please enter your email!").notEmpty(), // check if email is not empty and it is a valid email
        body("password", "Please enter your password!").notEmpty(),
    ],
    loginHandler
);

router.get("/get-user", getAnUser);

router.get("/logout", logoutController);

module.exports = router;
