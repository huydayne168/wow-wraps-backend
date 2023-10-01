const User = require("../models/User");

require("dotenv").config();
const { env } = require("process");

const jwt = require("jsonwebtoken");

//////////////////// Post LOGIN users:
exports.refreshTokenController = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const currentUser = await User.findOne({
        refreshToken,
    }).populate("roleId");

    if (!currentUser) {
        return res.sendStatus(403); //Forbidden
    }

    jwt.verify(refreshToken, env.REFRESH_TOKEN, (err, decoded) => {
        if (err || currentUser.email !== decoded.UserInfo.email) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    email: currentUser.email,
                    roleId: currentUser.roleId.name,
                },
            },
            env.ACCESS_TOKEN,
            {
                expiresIn: "15m",
            }
        );
        res.status(200).json({ accessToken });
    });
};
