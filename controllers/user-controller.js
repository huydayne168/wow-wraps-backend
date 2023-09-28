const User = require("../models/User");

const bcryptjs = require("bcryptjs");

const sgMail = require("@sendgrid/mail");

require("dotenv").config();
const { env } = require("process");

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
        const verifyCode = req.body.verifyCode;

        // when user send data that has verifyCode:
        if (verifyCode) {
            if (Number(verifyCode) === randomCode) {
                // save user here:
                // hash password:
                const hashedPassword = await bcryptjs.hash(password, 12);

                const newUser = new User({
                    userName,
                    password: hashedPassword,
                    email,
                    phoneNumber,
                    cart: [],
                    checkout: [],
                    roles: {
                        user: ROLES_LIST.user,
                    },
                });

                await newUser.save();
                return res.status(200).json({ message: "Created account!!!" });
            } else {
                return res
                    .status(400)
                    .json({ verifyCodeErr: "Your verify code is wrong!" });
            }
        }

        // check if any input value is invalid:
        console.log(req.body);
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
            return res.status(409).json({
                emailErr: "This email has already been used!",
            });
        }
        if (phoneNumberFoundedUser) {
            return res.status(409).json({
                phoneNumberErr: "This phone number has already been used!",
            });
        }

        // if all are good, we send an email to verify user:
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

// function to filter users:
function applyFilter(
    users,
    { _idQuery, userNameQuery, emailQuery, phoneNumberQuery, roleQuery }
) {
    const filteredUsers = [];
    console.log(_idQuery);
    for (const user of users) {
        if (_idQuery && !user._id.toString().includes(_idQuery)) {
            continue;
        }
        if (
            userNameQuery &&
            !user.userName.toLowerCase().includes(userNameQuery.toLowerCase())
        ) {
            continue;
        }
        if (phoneNumberQuery && !user.phoneNumber.includes(phoneNumberQuery)) {
            continue;
        }
        if (emailQuery && !user.email.includes(emailQuery)) {
            continue;
        }
        if (roleQuery && !Object.keys(user).includes(roleQuery.toLowerCase())) {
            continue;
        }
        filteredUsers.push(user);
    }

    return filteredUsers;
}

// control to get users:
exports.getUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find();
        const search = req.query;
        return res.status(200).json(applyFilter(allUsers, search));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// get an user:
exports.getAnUser = async (req, res, next) => {
    try {
        const userId = req.query._id;
        const foundUser = await User.findOne({
            _id: userId,
        });
        if (!foundUser) return res.sendStatus(401);
        return res.status(200).json(foundUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// GET CART
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const user = await User.findById(userId).populate("cart.product");
        console.log(userId);
        if (!user) return res.sendStatus(403);
        return res.json(user.cart);
    } catch (error) {
        next(error);
    }
};

// ADD PRODUCT TO CART:
exports.addToCart = async (req, res, next) => {
    try {
        const { userId, product: productId, quantity } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.sendStatus(403);

        // Is this product already exist in cart?
        const isExist = user.cart.some(
            (cartItem) => cartItem.productId === productId
        );
        if (isExist) {
            user.cart.map((cartItem) => {
                if (cartItem.product === productId) {
                    cartItem.quantity += quantity;
                }
                return cartItem;
            });
        } else {
            user.cart.push({
                product: productId,
                quantity,
            });
        }

        await user.save();
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// UPDATE CART :
exports.updateCart = async (req, res, next) => {
    try {
        const newCart = req.body.cart;
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) return res.sendStatus(403);
        user.cart = newCart;
        await user.save();
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// DELETE ITEM IN CART:
exports.deleteCart = async (req, res, next) => {
    try {
        const cartId = req.body.cartId;
        const userId = req.body.userId;
        const user = await User.findById(userId);
        console.log(cartId);
        if (!user) return res.sendStatus(403);
        const newCart = user.cart.filter(
            (item) => item._id.toString() !== cartId
        );
        user.cart = newCart;
        await user.save();
        console.log(user.cart);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
