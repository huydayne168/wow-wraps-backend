const express = require("express");
const { env } = require("process");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const corsConfig = require("./configs/corsConfig");
// import routers:
const adminRouter = require("./routers/admin-router");
const productRouter = require("./routers/product-router");
const tagRouter = require("./routers/tag-router");
const categoryRouter = require("./routers/category-router");

// import middlewares:
const credentials = require("./middlewares/credential");
const { verifyJWT } = require("./middlewares/verifyJWT");

// import controllers:
const {
    refreshTokenController,
} = require("./controllers/refreshToken-controller");

/////// Middlewares:
app.use(credentials);
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "35mb" }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "35mb",
        parameterLimit: 50000,
    })
);
// refresh access token route:
app.get("/refresh", refreshTokenController);

// admin router:
app.use("/admin", adminRouter);

// product router:
app.use("/api/product", productRouter);
// tag router:
app.use("/api/tag", tagRouter);

// category router:
app.use("/api/category", categoryRouter);

// error handling:
app.use((error, req, res, next) => {
    const errStatus = error.status || 500;
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
