const FlashSale = require("../models/FlashSale");
const cron = require("node-cron");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { env } = require("process");
const User = require("../models/User");

const HTMLSale = (products, name, start, end, discountPercent) => `<html>
<head>
<style>

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
table {
  border-collapse: collapse;
  width: 100%;
}

.bold {
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
}
.info {
  margin: 5px 0;
}
</style>
</head>
<body>
  <h2>Hi${name}</h2>
  <div>We have a promotion programming up to ${discountPercent}% begin ${new Date(
    start
)} to ${new Date(end)}</div>
  <table>
  <tr>
    <th>Product's Name</th>
    <th>Image</th>
    <th>Origin Price</th>
    <th>Sale Price</th>
  </tr>
    ${products
        .map((product) => {
            return `
        <tr>
          <td>${product.name}</td>
          <td><img style="height:100px;" src='${product.image}' alt=${product.name} /></td>
          <td>${product.price}$</td>
          <td>${product.salePrice}$</td>
        </tr>
      `;
        })
        .join("")}
</table>
  <div>Limit quantity! Hurry up</div>
  <div><a href="http://localhost:3000">Visit website</a></div>
</body>
</html>`;

// add new flash sale:
exports.addFlashSale = async (req, res, next) => {
    try {
        const { name, discountPercent, start, end, products } = req.body;
        const newFS = new FlashSale({
            name,
            discountPercent,
            start,
            end,
            products,
            isActive: false,
            isOver: false,
            isDelete: false,
        });
        if (products.length === 0) {
            return res.status(422).json({
                message: "No Products chose!",
            });
        }
        const inputError = validationResult(req);
        if (!inputError.isEmpty()) {
            return res.status(422).json({
                validationErrors: inputError.array(),
            });
        }
        const allProducts = await Product.find({ isDeleted: false });
        const users = await User.find().select("email -_id");
        console.log(users);
        const emails = users.map((user) => user.email);
        const saleProducts = allProducts.filter((product) =>
            newFS.products.includes(product._id)
        );
        const now = new Date();
        const startTime = new Date(start);
        const endTime = new Date(end);
        // is the time to enable the flash sale?
        if (now.getTime() < startTime.getTime()) {
            const stringTime = `${startTime.getMinutes()} ${
                startTime.getHours() > now.getHours()
                    ? startTime.getHours()
                    : "*"
            } ${
                startTime.getDate() > now.getDate() ? startTime.getDate() : "*"
            } ${
                startTime.getMonth() > now.getMonth()
                    ? startTime.getMonth() + 1
                    : "*"
            } *`;
            // if not wait when the time hit
            console.log(stringTime);
            const activeFs = cron.schedule(stringTime, async () => {
                console.log(newFS, "time up!");
                newFS.isActive = true;
                await newFS.save();
                saleProducts.forEach(async (product) => {
                    product.flashSale = [...product.flashSale, newFS._id];
                    // check if there is an flashSale exist in that item:
                    if (product.salePrice > 0) {
                        product.salePrice = (
                            (product.salePrice *
                                (100 - newFS.discountPercent)) /
                            100
                        ).toFixed(2);
                    } else {
                        product.salePrice = (
                            (product.price * (100 - newFS.discountPercent)) /
                            100
                        ).toFixed(2);
                    }
                    await product.save();
                });
                activeFs.stop();
            });
        } else {
            newFS.isActive = true;
            await newFS.save();
            saleProducts.forEach(async (product) => {
                product.flashSale = [...product.flashSale, newFS._id];
                // check if there is an flashSale exist in that item:
                if (product.salePrice > 0) {
                    product.salePrice = (
                        (product.salePrice * (100 - newFS.discountPercent)) /
                        100
                    ).toFixed(2);
                } else {
                    product.salePrice = (
                        (product.price * (100 - newFS.discountPercent)) /
                        100
                    ).toFixed(2);
                }
                await product.save();
            });
        }

        // disable flash sale when the end time hit:
        const stringEndTime = `${endTime.getMinutes()} ${
            endTime.getHours() > now.getHours() ? endTime.getHours() : "*"
        } ${endTime.getDate() > now.getDate() ? endTime.getDate() : "*"} ${
            endTime.getMonth() > now.getMonth() ? start.getMonth() + 1 : "*"
        } *`;
        const InActiveFs = cron.schedule(stringEndTime, async () => {
            console.log(newFS, "time up!");
            newFS.isActive = false;
            await newFS.save();
            saleProducts.forEach(async (product) => {
                product.flashSale = product.flashSale.filter(
                    (fs) => fs !== newFS._id
                );
                product.salePrice = null;
                await product.save();
            });
            InActiveFs.stop();
        });

        sgMail.setApiKey(env.SENDGRID_KEY);
        const msg = {
            to: emails,
            from: env.EMAIL, // Use the email address or domain you verified above
            subject: "from WOW WRAPS",
            text: HTMLSale(products, name, start, end, discountPercent),
            html: HTMLSale(products, name, start, end, discountPercent),
        };
        sgMail.send(msg).then(
            () => {
                console.log("sent!");
            },
            (error) => {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body);
                    return res
                        .status(500)
                        .json({ message: "Can not send email!" });
                }
            }
        );

        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const applyFilters = (
    flashSales,
    { page, _idQuery, nameQuery, sortActive }
) => {
    const filteredFlashSales = [];
    for (const fs of flashSales) {
        if (_idQuery && !fs._id.toString().includes(_idQuery)) {
            continue;
        }

        if (
            nameQuery &&
            !fs.name.toLowerCase().includes(nameQuery.toLowerCase())
        ) {
            continue;
        }

        if (sortActive) {
            if (JSON.parse(sortActive)) {
                if (!fs.isActive) {
                    continue;
                }
            } else if (!JSON.parse(sortActive)) {
                if (fs.isActive) {
                    continue;
                }
            }
        }
        filteredFlashSales.push(fs);
    }
    const curPage = Number(page);
    return {
        flashSales: filteredFlashSales.slice(
            (curPage - 1) * 5,
            (curPage - 1) * 5 + 5
        ),
        totalFlashSales: filteredFlashSales.length,
    };
};

// get flash sales:
exports.getFlashSales = async (req, res, next) => {
    try {
        const flashSales = await FlashSale.find({ isDelete: false }).populate(
            "products"
        );

        return res.status(200).json(applyFilters(flashSales, req.query));
    } catch (error) {
        next(error);
    }
};

// delete flash sale:
exports.deleteFlashSale = async (req, res, next) => {
    try {
        const flashSaleId = req.query.flashSaleId;
        const flashSale = await FlashSale.findById(flashSaleId);
        if (!flashSale) return res.sendStatus(409);
        flashSale.isDelete = true;
        await flashSale.save();
        const allProducts = await Product.find({ isDeleted: false });
        const saleProducts = allProducts.filter((product) =>
            flashSale.products.includes(product._id)
        );
        saleProducts.forEach(async (product) => {
            product.flashSale = product.flashSale.filter(
                (fs) => fs !== flashSale._id
            );
            product.salePrice = null;
            await product.save();
        });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
