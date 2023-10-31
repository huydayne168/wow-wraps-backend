const Role = require("../models/Role");

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) {
            return res.status(401);
        }
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (result) {
            next();
        } else {
            return res.status(401).json({ message: "not available role" });
        }
    };
};

module.exports = verifyRoles;
