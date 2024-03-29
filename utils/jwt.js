const jwt = require("jsonwebtoken");
const { logger } = require("../utils/tools");

const getTokenFromReq = (req) => {
    const authorization =
        req.headers["authorization"] || req.headers["Authorization"];
    if (authorization?.startsWith("Bearer ") && authorization.split(" ")[1]) {
        return authorization.split(" ")[1];
    }
    return null;
};

const generateToken = (payload) => {
    let { _id, roles } = payload;
    return jwt.sign({ _id, roles }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

const verifyToken = (token) => {
    token = token ?? "";
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
            // console.log("verifyToken verify token error: ", error);
            // console.log("verifyToken verify token payload: ", payload);
            if (error) {
                reject(error);
            } else {
                let data = {};
                data.payload = payload;
                data.newToken = generateToken(payload);
                resolve(data);
            }
        });
    });
};

module.exports = { generateToken, verifyToken, getTokenFromReq };
