const Role = require("../models/Role");

// get roles:
exports.getRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({ isActive: true }).sort({
            createdAt: -1,
        }); // just get role that is still active
        return res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// add role:
exports.addRole = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newRole = new Role({
            name,
            description,
            isActive: true,
        });

        await newRole.save();
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// edit role:
exports.editRole = async (req, res, next) => {
    try {
        const isActive = req.body.isActive;
        const roleId = req.body.roleId;
        const role = await Role.findById(roleId);
        if (!role) return res.status(409).json("This role is not exist!");
        role.isActive = isActive;
        await role.save();
        return res.sendStatus(204);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
