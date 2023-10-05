const Product = require("../models/Product");
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
        const tagsList = await Tag.find().sort({ createdAt: -1 });
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

        const allProducts = await Product.find().populate("tags");
        const products = allProducts.filter((p) => {
            return p.tags.some((_tag) => _tag._id === tag._id);
        });
        products.map(async (p) => {
            p.tags = p.tags.filter((_tag) => _tag._id !== tag._id);
            await p.save();
        });
        await Tag.deleteOne({ _id: tag._id });
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
