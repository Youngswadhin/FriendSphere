"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const friendRouter = (0, express_1.Router)();
/**
 * @swagger
 * /friend-request/withdraw:
 *   delete:
 *     summary: Withdraw a friend request
 *     tags:
 *       - Friend Request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the friend request to withdraw
 *     responses:
 *       200:
 *         description: Friend request withdrawn
 *       500:
 *         description: Internal server error
 */
friendRouter.delete('/remove', async (req, res) => {
    const { userId } = req.user;
    const { id } = req.body;
    try {
        await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                friends: {
                    disconnect: {
                        id,
                    },
                },
            },
        });
        res.status(200).json({ message: 'Friend Removed' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove from your friends' });
    }
});
exports.default = friendRouter;
//# sourceMappingURL=friend.js.map