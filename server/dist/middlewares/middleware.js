"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKeyForUser = exports.secretKeyForAdmins = exports.adminAuthentication = exports.userAuthentication = exports.generateKeyForUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKeyForAdmins = "adminsSecretK3Y";
exports.secretKeyForAdmins = secretKeyForAdmins;
const secretKeyForUser = "usersSecretK3Y";
exports.secretKeyForUser = secretKeyForUser;
// Function to generate JWT token
function generateKeyForUser(idPass, secretKey) {
    const payload = { username: idPass.username };
    let token = jsonwebtoken_1.default.sign(payload, secretKey);
    console.log(`token generated`);
    return token;
}
exports.generateKeyForUser = generateKeyForUser;
// Middleware for admin authentication
const adminAuthentication = (req, res, next) => {
    const token = req.headers.auth;
    if (token && typeof token === 'string') {
        jsonwebtoken_1.default.verify(token, secretKeyForAdmins, (err, user) => {
            if (err) {
                console.log(`JWT verification failed: ${err.message}`);
                res.status(401).json({ error: "JWT Authentication failed" });
            }
            if (!user || user == undefined) {
                console.log(`JWT verification failed`);
                res.status(401).json({ error: "JWT Authentication failed" });
                return console.log({ error: "failed. user is undefined" });
            }
            if (typeof user === 'string') {
                res.status(401).json({ error: "JWT Authentication failed" });
                return console.log({ error: "failed. userObj is string" });
            }
            req.headers["username"] = user.username;
            console.log(`Token is valid. welcome ${user.username}`);
            next();
        });
    }
    else {
        res.status(401).json({ error: "Invalid/tampered token" });
    }
};
exports.adminAuthentication = adminAuthentication;
// Middleware for user authentication
const userAuthentication = (req, res, next) => {
    const token = req.headers.auth;
    if (token && typeof token === 'string') {
        jsonwebtoken_1.default.verify(token, secretKeyForUser, (err, user) => {
            if (err) {
                console.log(`JWT verification failed: ${err.message}`);
                res.status(401).json({ error: "JWT Authentication failed" });
            }
            if (!user || user == undefined) {
                console.log(`JWT verification failed`);
                res.status(401).json({ error: "JWT Authentication failed" });
                return { error: "failed. user is undefined" };
            }
            if (typeof user === 'string') {
                res.status(401).json({ error: "JWT Authentication failed" });
                return { error: "failed. user is undefined" };
            }
            req.headers["username"] = user.username;
            console.log(`Token is valid. welcome ${user.username}`);
            next();
        });
    }
    else {
        res.status(401).json({ error: "Invalid/tampered token" });
    }
};
exports.userAuthentication = userAuthentication;
