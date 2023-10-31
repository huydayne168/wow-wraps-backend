const User = require("../models/User");
const Role = require("../models/Role");
const bcryptjs = require("bcryptjs");

require("dotenv").config();
const { env } = require("process");

const sgMail = require("@sendgrid/mail");

const { validationResult } = require("express-validator");

const ROLES_LIST = require("../configs/roles-list");

// random a code to verify admin
const getCode = function () {
    let random = 0;
    while (random < 10000) {
        random = Math.random() * 99999;
    }
    return Math.round(random);
};
let randomCode;

//////////////////// Post sign up admin data:
exports.postSignup = async (req, res, next) => {
    try {
        const userName = req.body.userName;
        const password = req.body.password;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const secretKey = req.body.secretKey;
        const verifyCode = req.body.verifyCode;

        // check if user submit the verify key:
        if (verifyCode) {
            if (Number(verifyCode) === randomCode) {
                // save admin here:
                // hash password:
                const hashedPassword = await bcryptjs.hash(password, 12);
                const adminRole = await Role.find({ name: "admin" });
                const adminRoleId = adminRole[0]._id;
                const newAdmin = new User({
                    userName,
                    password: hashedPassword,
                    email,
                    phoneNumber,
                    cart: [],
                    checkout: [],
                    roleId: adminRoleId,
                });

                await newAdmin.save();
                return res.status(200).json({ message: "Created account!!!" });
            } else {
                return res
                    .status(400)
                    .json({ verifyCodeErr: "Your verify code is wrong!" });
            }
        }

        // check if any input value is invalid:
        const inputError = validationResult(req);
        if (!inputError.isEmpty()) {
            return res.status(400).json({
                validationErrors: inputError.array(),
            });
        }

        // check if the email and the phone number is already exist?
        const emailFoundedUser = await User.findOne({
            email: email,
        });

        const phoneNumberFoundedUser = await User.findOne({
            phoneNumber: phoneNumber,
        });

        if (emailFoundedUser) {
            return res.status(400).json({
                emailErr: "This email has already been used!",
            });
        }
        if (phoneNumberFoundedUser) {
            return res.status(400).json({
                phoneNumberErr: "This phone number has already been used!",
            });
        }

        // check secret key:
        if (!secretKey === env.SECRET_ADMIN_KEY) {
            return res.sendStatus(400).json({ message: "wrong secret key!" });
        }

        // if all are good, we send an email to verify admin:
        sgMail.setApiKey(env.SENDGRID_KEY);
        randomCode = getCode();
        const msg = {
            to: email,
            from: env.EMAIL, // Use the email address or domain you verified above
            subject: "from WOW WRAPS",
            text: `
                Thanks for registering!
                Please use this code to verify your account: ${randomCode}
            `,
            html: `
                <h1>Thanks for registering!</h1>
                <p>Please use this code to verify your account:</p>
                <strong>${randomCode}</strong>
            `,
        };

        sgMail.send(msg).then(
            () => {
                return res.status(200).json({ message: "Sent!" });
            },
            (error) => {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body);
                    return res
                        .status(500)
                        .json({ message: "Can not send email!" });
                }
            }
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};
