const jwt = require("jsonwebtoken");
require("dotenv").config();
const { env } = require("process");

exports.verifyJWT = async (req, res, next) => {
    const accessToken = req.headers.Authentication.split()[1];
    jwt.verify(accessToken, env.ACCESS_TOKEN, (error, decoded) => {
        if (error || currentUser.email !== decoded.UserInfo.email) {
            return res.sendStatus(403);
        }
        req.user = decoded.UserInfo.email;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};
