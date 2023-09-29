const Tag = require("../models/Tag");

function applyFilter(categories, tagQuery) {
    const filteredCategories = [];

    for (const tag of categories) {
        if (
            tagQuery &&
            !tag.name.toLowerCase().includes(tagQuery.toLowerCase())
        ) {
            continue;
        }

        filteredCategories.push(tag);
    }
    return filteredCategories;
}

exports.getTags = async (req, res, next) => {
    try {
        const tagsList = await Tag.find();
        const tagQuery = req.query.tagQuery;
        res.status(200).json(applyFilter(tagsList, tagQuery));
    } catch (error) {
        next(error);
    }
};

exports.addTag = async (req, res, next) => {
    try {
        const data = req.body.newTag;
        const newTag = new Tag({
            name: data,
        });
        await newTag.save();
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.deleteTag = async (req, res, next) => {
    try {
        const tag = req.query.tag;

        await Tag.deleteOne({ name: tag });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
