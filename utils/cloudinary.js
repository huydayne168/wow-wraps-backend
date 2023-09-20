require("dotenv").config();
const { env } = require("process");
const cloudinaryModule = require("cloudinary");
const cloudinary = cloudinaryModule.v2;
console.log(env.CLOUDINARY_NAME);
cloudinary.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
