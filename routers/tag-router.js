const express = require("express");

const router = express.Router();
const tagController = require("../controllers/tag-controller");
const { verify } = require("jsonwebtoken");
const { verifyJWT } = require("../middlewares/verifyJWT");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../configs/roles-list");

router.get(
    "/get-tags",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    tagController.getTags
);

router.post(
    "/add-tag",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    tagController.addTag
);

router.delete(
    "/delete-tag",
    verifyJWT,
    verifyRoles(ROLES_LIST.admin),
    tagController.deleteTag
);

module.exports = router;
