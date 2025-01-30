"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const get_1 = __importDefault(require("lodash/get"));
const protectedRoutes = [
    '/auth/update',
    '/auth/update-password',
    '/friend-request/create',
    '/friend-request/get',
    '/friend-request/accept',
    '/friend-request/reject',
    '/suggest',
    '/search',
];
function authGuard(req, res, next) {
    if (protectedRoutes.includes(req.path)) {
        const token = (0, get_1.default)(req, 'cookies.jwt');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        try {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ error: 'Failed to authenticate token' });
                }
                req.user = decoded;
                next();
            });
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        next();
    }
}
//# sourceMappingURL=auth-middleware.js.map