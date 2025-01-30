import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { CronJob } from 'cron'
import prisma from '../../prisma/prisma'

const friendRouter = Router()

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
  const { userId } = req.user
  const { id } = req.body

  try {
    await prisma.user.update({
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
    })
    res.status(200).json({ message: 'Friend Removed' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from your friends' })
  }
})

export default friendRouter
