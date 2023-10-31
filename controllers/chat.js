const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const Role = require("../models/Role");
const io = require("../socketio");

exports.createRoom = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "no user" });
        }
        const adminRole = await Role.find({ name: "admin" });
        const allAdmin = await User.find({ roleId: adminRole._id });
        const allAdminIds = allAdmin.map((admin) => admin._id);
        const newRoom = new Room({
            users: [...allAdminIds, userId],
        });
        await newRoom.save();
        return res.status(201).json(newRoom);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getRoom = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "no user" });
        }
        const rooms = await Room.find().populate("users.user");
        console.log(rooms.users);
        const wantedRoom = rooms.filter((room) => {
            return room.users.some((u) => u.toString() === userId.toString());
        })[0];
        console.log(wantedRoom);
        if (!wantedRoom) {
            return res.status(404).json({ message: "no room yet!" });
        } else {
            return res.status(200).json(wantedRoom);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        const { userId, content, roomId } = req.body;
        if (content === "") {
            return res
                .status(400)
                .json({ message: "no message content was sent!" });
        }
        const newMessage = new Message({
            content: content,
            user: userId,
            roomId: roomId,
        });
        await newMessage.save();
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getMessage = async (req, res, next) => {
    try {
        const roomId = req.query.roomId;
        const messages = await Message.find({ roomId: roomId });
        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
