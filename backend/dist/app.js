"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./routes/router"));
const cors_1 = __importDefault(require("cors"));
const auth_middleware_1 = require("./middleware/auth-middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app = (0, express_1.default)();
// Custom error handler
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
}
// Default route
function defaultRoute(req, res, next) {
    res.sendStatus(404);
}
// @ts-ignore
exports.app.use(body_parser_1.default.json());
// @ts-ignore
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use((0, morgan_1.default)('tiny'));
exports.app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(auth_middleware_1.authGuard);
exports.app.use('/', router_1.default);
exports.app.use(defaultRoute); // default route has to be last route
exports.app.use(errorHandler); // Error handler goes last
//# sourceMappingURL=app.js.map