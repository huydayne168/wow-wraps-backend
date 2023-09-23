const express = require("express");

const router = express.Router();
const categoryController = require("../controllers/category-controller");
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");

router.get(
    "/get-categories",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    categoryController.getCategories
);

router.post(
    "/add-category",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    categoryController.addCategory
);

router.delete(
    "/delete-category",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    categoryController.deleteCategory
);

module.exports = router;
