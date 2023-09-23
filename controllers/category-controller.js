const Category = require("../models/Category");

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
        const categoriesList = await Category.find();
        const categoryQuery = req.query.categoryQuery;
        res.status(200).json(
            applyFilter(categoriesList, categoryQuery).map(
                (category) => category.name
            )
        );
    } catch (error) {
        next(error);
    }
};

exports.addCategory = async (req, res, next) => {
    try {
        const data = req.body.newCategory;
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
        const category = req.query.category;
        await Category.deleteOne({ name: category });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
