const express = require("express");

const router = express.Router();
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");
const userController = require("../controllers/user-controller");
const { body } = require("express-validator");
const { loginHandler } = require("../controllers/login-controller");
const { logoutController } = require("../controllers/logout-controller");

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

// route for user to log in:
router.post("/login", loginHandler);

// route ti log out:
router.post("/logout", logoutController);

// route to get all user here:
router.get(
    "/get-users",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.counselor),
    userController.getUsers
);

// router to get an user:
router.get("/get-user", userController.getAnUser);

// route to get user's cart:
router.get(
    "/get-cart",
    verifyJWT,
    verifyRoles(ROLES_LIST.user),
    userController.getCart
);

// router to add a product to cart:
router.post(
    "/add-to-cart",
    verifyJWT,
    verifyRoles(ROLES_LIST.user),
    userController.addToCart
);

// router to update cart:
router.post(
    "/update-cart",
    verifyJWT,
    verifyRoles(ROLES_LIST.user),
    userController.updateCart
);

// router to delete a product to cart:
router.post(
    "/delete-cart",
    verifyJWT,
    verifyRoles(ROLES_LIST.user),
    userController.deleteCart
);

module.exports = router;
