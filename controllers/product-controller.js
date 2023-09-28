const Product = require("../models/Product");
const User = require("../models/User");
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
function applyFilters(
    products,
    {
        _idQuery,
        nameQuery,
        category,
        sortRate,
        sortLowPrice,
        sortHighPrice,
        page,
    }
) {
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
            category &&
            product.category.toLowerCase() !== category.toLowerCase()
        ) {
            continue;
        }

        filteredProducts.push(product);
    }
    if (sortRate && JSON.parse(sortRate)) {
        filteredProducts.sort(
            (productA, productB) =>
                Number(productB.rate) - Number(productA.rate)
        );
    } else if (sortRate && !JSON.parse(sortRate)) {
        filteredProducts.sort(
            (productA, productB) =>
                Number(productA.rate) - Number(productB.rate)
        );
    } else if (sortLowPrice && JSON.parse(sortLowPrice)) {
        filteredProducts.sort(
            (productA, productB) =>
                Number(productA.price) - Number(productB.price)
        );
    } else if (sortHighPrice && JSON.parse(sortHighPrice)) {
        filteredProducts.sort(
            (productA, productB) =>
                Number(productB.price) - Number(productA.price)
        );
    }
    const isLastPage = (Number(page) - 1) * 5 + 5 >= filteredProducts.length;

    if (isLastPage) {
        return {
            products: filteredProducts.slice(
                (curPage - 1) * 5,
                (curPage - 1) * 5 + 5
            ),
            isLastPage: true,
            totalProducts: filteredProducts.length,
        };
    }
    return {
        products: filteredProducts.slice(
            (curPage - 1) * 5,
            (curPage - 1) * 5 + 5
        ),
        isLastPage: false,
        totalProducts: filteredProducts.length,
    };
}

exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        if (allProducts) {
            return res.status(200).json(applyFilters(allProducts, req.query));
        }
    } catch (error) {
        next(error);
        console.log(error);
    }
};

exports.getRelatedProducts = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const category = req.query.category;
        const products = await Product.find();
        const relatedProducts = products.filter((product) => {
            return (
                product.category === category &&
                product._id.toString() !== productId
            );
        });

        return res.status(200).json(relatedProducts);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.query._id;
        const carts = await User.find()
            .populate("cart.product")
            .select("cart.product -_id");
        console.log(carts);
        const usersHaveCart = carts.map((cart) => {
            return [...cart.cart];
        });
        // check if the product that we want to delete exist in any cart?
        console.log(usersHaveCart);
        // const result = await Product.deleteOne({ _id: productId });
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
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

// ADD REVIEW:
exports.addReview = async (req, res, next) => {
    try {
        const { productId, comment, date, ratePoint, user: userId } = req.body;
        console.log(ratePoint);
        const product = await Product.findById(productId);
        const user = await User.findById(userId);
        if (!product) return res.sendStatus(404);
        product.reviews.push({
            date,
            comment,
            ratePoint,
            user,
        });
        console.log(user);
        product.rate = Math.round(
            product.reviews.reduce((init, next) => init + next.ratePoint, 0) /
                product.reviews.length
        );
        await product.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

// GET REVIEWS:
exports.getReviews = async (req, res, next) => {
    try {
        const { productId } = req.query;
        const product = await Product.findById(productId).populate(
            "reviews.user"
        );
        // const reviews = await product.reviews.populate("reviews");
        if (!product) return res.sendStatus(404);
        return res.status(200).json(product.reviews);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
