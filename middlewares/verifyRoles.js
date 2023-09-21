const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.status(401);
        }
        const rolesArray = [...allowedRoles];
        const result = req.roles
            .map((role) => rolesArray.includes(Number(role)))
            .find((value) => value === true);
        if (result) {
            next();
        } else {
            return res.status(401).json({ message: "not available role" });
        }
    };
};

module.exports = verifyRoles;
