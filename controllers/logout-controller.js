const User = require("../models/User");

// Log out for all king of user:
exports.logoutController = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204);

    const currentUser = await User.find({ refreshToken: cookies.jwt });
    // if there is no user has this freshToken in db:
    if (!currentUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.sendStatus(204);
    }

    currentUser.refreshToken = null;
    // await currentUser.save();

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });
    return res.sendStatus(204);
};
