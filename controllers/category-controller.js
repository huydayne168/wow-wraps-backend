const Category = require("../models/Category");
const Product = require("../models/Product");
function applyFilter(categories, categoryQuery) {
    const filteredCategories = [];

    for (const category of categories) {
        if (
            categoryQuery &&
            !category.name.toLowerCase().includes(categoryQuery.toLowerCase())
        ) {
            continue;
        }

        filteredCategories.push(category);
    }
    return filteredCategories;
}

exports.getCategories = async (req, res, next) => {
    try {
        const categoriesList = await Category.find().sort({ createdAt: -1 });
        const categoryQuery = req.query.categoryQuery;
        res.status(200).json(applyFilter(categoriesList, categoryQuery));
    } catch (error) {
        next(error);
    }
};

exports.addCategory = async (req, res, next) => {
    try {
        const data = req.body.newCategory;
        const duplicateCate = await Category.find({ name: data });
        if (duplicateCate[0]) {
            return re.sendStatus(409);
        }
        const newCategory = new Category({
            name: data,
        });
        await newCategory.save();
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.query.categoryId;
        console.log(categoryId);
        const products = await Product.find({ category: categoryId });
        if (products[0]) {
            return res.sendStatus(409);
        }
        await Category.deleteOne({ _id: categoryId });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
