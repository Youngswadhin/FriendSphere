"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const searchRouter = express_1.default.Router();
/**
 * @swagger
 * /search/{string}:
 *   get:
 *     summary: Search for users by name or email
 *     tags: [Search]
 *     parameters:
 *       - in: path
 *         name: string
 *         required: true
 *         schema:
 *           type: string
 *         description: The search string to look for in user names and emails
 *     responses:
 *       200:
 *         description: A list of users matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
searchRouter.get('/', async (req, res) => {
    const { userId } = req.user;
    const searchString = req.query.string;
    try {
        const users = await prisma_1.default.user.findMany({
            take: 10,
            where: {
                NOT: {
                    id: userId,
                },
                OR: [
                    { name: { contains: searchString, mode: 'insensitive' } },
                    { email: { contains: searchString, mode: 'insensitive' } },
                    { address: { city: { contains: searchString, mode: 'insensitive' } } },
                    { address: { country: { contains: searchString, mode: 'insensitive' } } },
                    { address: { state: { contains: searchString, mode: 'insensitive' } } },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: {
                    select: {
                        country: true,
                        city: true,
                        zip: true,
                        state: true,
                        location: {
                            select: {
                                lat: true,
                                long: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = searchRouter;
//# sourceMappingURL=search.js.map