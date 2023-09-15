const express = require("express");
const { env } = require("process");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const adminRouter = require("./routers/admin-router");

/////// Middlewares:
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// admin router:
app.use("/api/admin", adminRouter);

// error handling:
app.use((error, req, res, next) => {
    const errStatus = error.status;
    const errMessage = error.message;
    res.status(errStatus).json({ message: errMessage });
});

mongoose
    .connect(env.MONGODB_URI)
    .then((res) => {
        app.listen(PORT, () => {
            console.log(">>>>>>>>>I AM RUNNING IN PORT:" + PORT + "<<<<<<<<<");
        });
    })
    .catch((err) => {
        res.status(500).json({ message: "Can not connect to database" });
    });
