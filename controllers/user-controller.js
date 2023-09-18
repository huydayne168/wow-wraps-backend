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

exports.getAnUser = async (req, res, next) => {
    try {
        console.log(req.query);
        const userId = req.query._id;
        const foundUser = await User.findById(userId);
        console.log(foundUser);
        if (!foundUser) return res.sendStatus(401);
        return res.status(200).json(foundUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
