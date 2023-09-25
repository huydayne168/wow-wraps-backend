const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
// create new product here:
exports.addNewProduct = async (req, res, next) => {
    const {
        name,
        category,
        amount,
        price,
        shortDescription,
        longDescription,
        tags,
        image,
    } = req.body;

    try {
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image, {
                folder: "wow-wraps-product-images",
            });

            if (uploadRes) {
                const newProduct = new Product({
                    name,
                    category,
                    amount,
                    price,
                    rate: 0,
                    category,
                    shortDescription,
                    longDescription,
                    tags: tags,
                    image: uploadRes.url,
                });
                await newProduct.save();
                res.sendStatus(200);
            }
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// function to search products:
function applyFilters(products, { _idQuery, nameQuery, category, page }) {
    const filteredProducts = [];
    const curPage = Number(page);
    for (const product of products) {
        if (_idQuery && !product._id.toString().includes(_idQuery)) {
            continue;
        }

        if (
            nameQuery &&
            !product.name.toLowerCase().includes(nameQuery.toLowerCase())
        ) {
            continue;
        }

        if (
            category !== "All" &&
            product.category.toLowerCase() !== category.toLowerCase()
        ) {
            continue;
        }

        filteredProducts.push(product);
    }
    const isLastPage = (Number(page) - 1) * 5 + 5 >= filteredProducts.length;
    if (isLastPage) {
        return {
            products: filteredProducts.slice(
                (curPage - 1) * 5,
                (curPage - 1) * 5 + 5
            ),
            isLastPage: true,
        };
    }
    return filteredProducts.slice((curPage - 1) * 5, (curPage - 1) * 5 + 5);
}

exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        if (allProducts) {
            return res.status(200).json(applyFilters(allProducts, req.query));
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.query._id;
        const result = await Product.deleteOne({ _id: productId });
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

exports.editProduct = async (req, res, next) => {
    try {
        const {
            _id,
            name,
            category,
            amount,
            price,
            shortDescription,
            longDescription,
            tags,
            image,
        } = req.body;
        const foundedProduct = await Product.findOne({ _id: _id });

        // update data:
        foundedProduct.name = name;
        foundedProduct.category = category;
        foundedProduct.amount = amount;
        foundedProduct.price = price;
        foundedProduct.shortDescription = shortDescription;
        foundedProduct.longDescription = longDescription;
        foundedProduct.tags = tags;
        foundedProduct.image = image;

        await foundedProduct.save();

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
