const express = require("express");

const router = express.Router();
const categoryController = require("../controllers/category-controller");
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");

router.get("/get-categories", categoryController.getCategories);

router.post(
    "/add-category",
    verifyJWT,
    verifyRoles("admin"),
    categoryController.addCategory
);

router.delete(
    "/delete-category",
    verifyJWT,
    verifyRoles("admin"),
    categoryController.deleteCategory
);

module.exports = router;
