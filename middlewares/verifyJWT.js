const jwt = require("jsonwebtoken");
require("dotenv").config();
const { env } = require("process");

exports.verifyJWT = (req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(" ")[1];
        jwt.verify(accessToken, env.ACCESS_TOKEN, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: "not same token" });
            }
            req.user = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
        });
    } else {
        res.status(403).json({ message: "no authentication header" });
    }
};
