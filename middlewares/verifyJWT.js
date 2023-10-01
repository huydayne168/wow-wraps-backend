const jwt = require("jsonwebtoken");
require("dotenv").config();
const { env } = require("process");
const Role = require("../models/Role");

exports.verifyJWT = (req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(" ")[1];
        jwt.verify(accessToken, env.ACCESS_TOKEN, (error, decoded) => {
            if (error) {
                return res
                    .status(403)
                    .json({ message: "not same refresh token" });
            }
            req.user = decoded.UserInfo.email;
            req.role = decoded.UserInfo.roleId;
            next();
        });
    } else {
        res.status(403).json({ message: "no authentication header" });
    }
};
