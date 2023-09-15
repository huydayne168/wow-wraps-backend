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
