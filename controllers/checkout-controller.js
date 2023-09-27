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

        console.log(paymentMethod);

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
