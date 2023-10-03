const User = require("../models/User");

const bcryptjs = require("bcryptjs");

require("dotenv").config();
const { env } = require("process");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

//////////////////// Post LOGIN users:
exports.loginHandler = (role) => {
    return async (req, res, next) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            console.log(password);
            const inputError = validationResult(req);
            if (!inputError.isEmpty()) {
                return res.status(400).json({
                    validationErrors: inputError.array(),
                });
            }

            const foundedUser = await User.findOne({ email: email }).populate(
                "roleId"
            );

            if (!foundedUser || foundedUser.roleId.name !== role) {
                return res.status(401).json({ emailErr: "Incorrect email!" });
            }

            const matchPassword = await bcryptjs.compare(
                password,
                foundedUser.password
            );

            if (!matchPassword) {
                return res
                    .status(401)
                    .json({ passwordErr: "Incorrect password!" });
            }

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        email: foundedUser.email,
                        roleId: foundedUser.roleId.name,
                    },
                },
                env.ACCESS_TOKEN,
                {
                    expiresIn: "15m",
                }
            );

            const refreshToken = jwt.sign(
                {
                    UserInfo: {
                        email: foundedUser.email,
                        roleId: foundedUser.roleId.name,
                    },
                },
                env.REFRESH_TOKEN,
                {
                    expiresIn: `${role === "admin" ? "3h" : "60d"}`,
                }
            );

            // store refresh token in db:
            foundedUser.refreshToken = refreshToken;
            await foundedUser.save();

            // store refresh token in cookie:
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000,
            });

            // send access token to fe to store in authentication state:
            res.json({ userInfo: foundedUser, accessToken });
        } catch (error) {
            console.log(error, "catch error in login controller");
            next(error);
        }
    };
};
