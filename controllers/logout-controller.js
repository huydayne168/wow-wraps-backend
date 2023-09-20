const User = require("../models/User");

exports.logoutController = async (req, res, next) => {
    const cookies = req.cookies;
    console.log(cookies.jwt);
    if (!cookies.jwt) return res.sendStatus(204);

    const currentUser = await User.find({ refreshToken: cookies.jwt });
    console.log(currentUser);
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
