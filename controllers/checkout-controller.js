const Checkout = require("../models/Checkout");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const { env } = require("process");
const Voucher = require("../models/Voucher");
// add checkout:
exports.addCheckout = async (req, res, next) => {
    try {
        const {
            date,
            user,
            receiverName,
            address,
            phoneNumber,
            products,
            total,
            paymentMethod,
            status,
            voucher,
        } = req.body;

        let finalTotal = total;

        if (voucher) {
            console.log(voucher);
            const foundVoucher = await Voucher.find({
                code: voucher.code,
                isDeleted: false,
            });
            console.log(foundVoucher);
            if (foundVoucher) {
                finalTotal = (
                    (Number(total) *
                        (100 - Number(foundVoucher[0].discountPercent))) /
                    100
                ).toFixed(2);
            } else {
                res.sendStatus(409);
            }
            foundVoucher[0].quantity = foundVoucher[0].quantity - 1;
            console.log(foundVoucher[0].quantity);
            if (foundVoucher[0].quantity === 0) {
                foundVoucher[0].isActive = false;
            }
            await foundVoucher[0].save();
        }

        const newCheckout = new Checkout({
            date,
            user,
            receiverName,
            phoneNumber,
            address,
            products,
            total: finalTotal,
            paymentMethod,
            status: status.toUpperCase(),
            isDeleted: false,
        });

        await newCheckout.save();
        const curUser = await User.findById(user);
        if (!curUser) return res.sendStatus(401);
        curUser.checkout.push(newCheckout._id);
        curUser.cart = [];
        await curUser.save();

        // Send email:
        sgMail.setApiKey(env.SENDGRID_KEY);
        const msg = {
            to: curUser.email,
            from: env.EMAIL, // Use the email address or domain you verified above
            subject: "from WOW WRAPS",
            text: `
                Thanks for your order!
                
            `,
            html: `
                <h1>Thanks for your order!</h1>
            `,
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

// get checkouts:
function applyFilters(
    checkouts,
    {
        page,
        _idQuery,
        userQuery,
        productsQuery,
        phoneNumberQuery,
        sortDate,
        sortPaymentMethod,
        sortStatus,
        sortTotal,
    }
) {
    console.log(sortStatus);
    const filteredCheckouts = [];
    for (const checkout of checkouts) {
        if (_idQuery && !checkout._id.toString().includes(_idQuery)) {
            continue;
        }

        if (
            userQuery &&
            !checkout.user.userName
                .toLowerCase()
                .includes(userQuery.toLowerCase())
        ) {
            continue;
        }

        if (
            productsQuery &&
            !checkout.products.some((item) =>
                item.product.name.toLowerCase().includes(productsQuery)
            )
        ) {
            continue;
        }

        if (
            phoneNumberQuery &&
            !checkout.phoneNumber.toLowerCase().includes(phoneNumberQuery)
        ) {
            continue;
        }

        if (
            sortPaymentMethod &&
            !checkout.paymentMethod === sortPaymentMethod
        ) {
            continue;
        }

        if (
            sortStatus &&
            checkout.status.toUpperCase() !== sortStatus.toUpperCase()
        ) {
            continue;
        }

        filteredCheckouts.push(checkout);
    }
    if (sortDate) {
        filteredCheckouts.sort((checkoutA, checkoutB) => {
            console.log(
                checkoutA.createdAt.getTime(),
                checkoutB.createdAt.getTime()
            );
            if (JSON.parse(sortDate)) {
                return (
                    checkoutB.createdAt.getTime() -
                    checkoutA.createdAt.getTime()
                );
            } else {
                return (
                    checkoutA.createdAt.getTime() -
                    checkoutB.createdAt.getTime()
                );
            }
        });
    }

    if (sortTotal) {
        filteredCheckouts.sort((checkoutA, checkoutB) => {
            if (JSON.parse(sortTotal)) {
                return checkoutB.total - checkoutA.total;
            } else {
                return checkoutA.total - checkoutB.total;
            }
        });
    }
    if (!page) {
        return {
            checkouts: filteredCheckouts,
            totalCheckouts: filteredCheckouts.length,
        };
    }
    // is the last page:
    const isLastPage = (Number(page) - 1) * 5 + 5 >= filteredCheckouts.length;
    const curPage = Number(page);

    if (isLastPage) {
        return {
            checkouts: filteredCheckouts.slice(
                (curPage - 1) * 5,
                (curPage - 1) * 5 + 5
            ),
            isLastPage: true,
            totalCheckouts: filteredCheckouts.length,
        };
    }
    return {
        checkouts: filteredCheckouts.slice(
            (curPage - 1) * 5,
            (curPage - 1) * 5 + 5
        ),
        isLastPage: false,
        totalCheckouts: filteredCheckouts.length,
    };
}

exports.getCheckouts = async (req, res, next) => {
    try {
        const allCheckouts = await Checkout.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate("products.product");
        if (allCheckouts) {
            return res.status(200).json(applyFilters(allCheckouts, req.query));
        }
    } catch (error) {
        next(error);
    }
};

exports.updateCheckout = async (req, res, next) => {
    try {
        const checkoutId = req.body.checkoutId;
        const status = req.body.status;
        console.log(checkoutId, status);
        const checkout = await Checkout.findById(checkoutId);
        checkout.status = status;
        await checkout.save();
        return res.sendStatus(204);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

exports.deleteCheckout = async (req, res, next) => {
    try {
        const checkoutId = req.query.checkoutId;
        console.log(checkoutId);
        const checkout = await Checkout.findById(checkoutId);
        checkout.isDeleted = true;
        await checkout.save();
        return res.sendStatus(204);
    } catch (error) {
        next(error);
        console.log(error);
    }
};
