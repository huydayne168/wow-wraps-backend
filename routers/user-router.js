const express = require("express");

const router = express.Router();
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");
const userController = require("../controllers/user-controller");
const { body } = require("express-validator");

// post create new user:
router.post(
    "/sign-up",
    [
        body("email", "Your email is not valid").notEmpty().isEmail(), // check if email is not empty and it is a valid email
        body("userName", "Please enter your username!")
            .notEmpty()
            .isLength({ min: 3 }),
        body("password", "Your password must has more than 8 characters!")
            .notEmpty()
            .isLength({ min: 8 }),
        body("phoneNumber")
            .notEmpty()
            .withMessage("Please enter your phone number")
            .isMobilePhone(["vi-VN", "en-US"])
            .withMessage("This phone number is not valid!")
            .isLength({ min: 10 }), // check phone number is not empty and the length is more than 10 numbers
    ],
    userController.postSignup
);

// route to get all user here:
router.get(
    "/get-users",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.counselor),
    userController.getUsers
);

module.exports = router;
