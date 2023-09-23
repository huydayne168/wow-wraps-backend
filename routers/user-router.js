const express = require("express");

const router = express.Router();
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");
const userController = require("../controllers/user-controller");

// post create new user:
// router.post("/user/sing-up");

// route to get all user here:
router.get(
    "/get-users",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.counselor),
    userController.getUsers
);

module.exports = router;
