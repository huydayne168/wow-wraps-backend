const Checkout = require("../models/Checkout");
const User = require("../models/User");
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
            paymentMethod,
            status,
        } = req.body;

        const newCheckout = new Checkout({
            date,
            user,
            receiverName,
            phoneNumber,
            address,
            products,
            paymentMethod,
            status,
        });

        await newCheckout.save();
        const curUser = await User.findById(user);
        if (!curUser) return res.sendStatus(401);
        curUser.checkout.push(newCheckout._id);
        curUser.cart = [];
        await curUser.save();
        res.sendStatus(204);
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
    }
) {
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

        if (sortStatus && !checkout.status === sortStatus) {
            continue;
        }

        filteredCheckouts.push(checkout);
    }
    if (sortDate && JSON.parse(sortDate)) {
        filteredCheckouts.sort((checkoutA, checkoutB) => {
            return (
                checkoutA.createdAt.getTime() - checkoutB.createdAt.getTime()
            );
        });
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
        const allCheckouts = await Checkout.find()
            .populate("user")
            .populate("products.product");
        if (allCheckouts) {
            return res.status(200).json(applyFilters(allCheckouts, req.query));
        }
    } catch (error) {
        next(error);
    }
};
