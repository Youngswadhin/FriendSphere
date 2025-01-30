"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth/auth-route"));
const friend_request_1 = __importDefault(require("./friend-request/friend-request"));
const search_1 = __importDefault(require("./search/search"));
const suggest_1 = __importDefault(require("./suggest/suggest"));
const friend_1 = __importDefault(require("./friend/friend"));
const swagger_ui_express_1 = require("swagger-ui-express");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    apis: ['./src/routes/**/*.ts'],
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API for JSONPlaceholder',
            version: '1.0.0',
            description: 'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'JSONPlaceholder',
                url: 'https://jsonplaceholder.typicode.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt',
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
});
const router = express_1.default.Router();
router.use('/auth', auth_route_1.default);
router.use('/friend-request', friend_request_1.default);
router.use('/search', search_1.default);
router.use('/suggest', suggest_1.default);
router.use('/friend', friend_1.default);
router.use('/api-docs', swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerSpec));
exports.default = router;
//# sourceMappingURL=router.js.map