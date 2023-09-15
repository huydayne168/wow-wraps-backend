const User = require("../models/User");

const bcryptjs = require("bcryptjs");
require("dotenv").config();
const { env } = require("process");

const sgMail = require("@sendgrid/mail");

const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const secretKey = req.body.secretKey;

        if (!secretKey === env.SECRET_ADMIN_KEY) {
            return res.sendStatus(401).json({ message: "wrong secret key!" });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
