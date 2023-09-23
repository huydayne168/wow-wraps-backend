const User = require("../models/User");

const bcryptjs = require("bcryptjs");

const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
    try {
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
