const express = require('express');
const cors = require("cors")
const app = express();

const {createProxyMiddleware} = require("http-proxy-middleware");

const rateLimit =
    require("express-rate-limit")
    require("dotenv").config();

const url = require("url");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
});
const whiteList = ["http://localhost:5173", "https://storied-kitten-b2870e.netlify.app/", "http://localhost:5030"];
const corsOptions = {
    origin: function(origin, callback){
        if (whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(limiter);

app.get("/", (req, res) => {
    res.send("This is my proxy server")
});

app.use("/world-weather-data", cors(corsOptions), (req, res, next) => {
    const city = url.parse(req.url).query
    createProxyMiddleware({
        target: `${process.env.BASE_API_URL_WORLD_WEATHER}${city}&api=no`,
        changeOrigin: true,
        pathRewrite: {
            [`^"/world-weather-data`]: " ",
        },
    })(req, res, next)
});

const port = process.env.PORT || 5030

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

module.exports = app