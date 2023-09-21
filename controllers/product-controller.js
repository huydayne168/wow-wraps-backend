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
    console.log(name);

    try {
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image, {
                folder: "wow-wraps-product-images",
            });
            console.log(uploadRes);

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
                    image: uploadRes,
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

function applyFilters(products, { _idQuery, nameQuery }) {
    const filteredProducts = [];

    for (const product of products) {
        if (_idQuery && !product._id.toString().includes(_idQuery)) {
            continue;
        }

        if (nameQuery && !product.name.includes(nameQuery)) {
            continue;
        }

        filteredProducts.push(product);
    }
    return filteredProducts;
}
exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        console.log(allProducts);
        if (allProducts) {
            return res.status(200).json(applyFilters(allProducts, req.query));
        }
    } catch (error) {
        next(error);
    }
};
