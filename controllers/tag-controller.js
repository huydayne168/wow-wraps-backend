const Tag = require("../models/Tag");

exports.getTags = async (req, res, next) => {
    try {
        const tagsList = await Tag.find();
        res.status(200).json(tagsList);
    } catch (error) {
        next(error);
    }
};

exports.addTag = async (req, res, next) => {
    try {
        const data = res.body.newTag;
        const newTag = new Tag(data);
        await newTag.save();
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
