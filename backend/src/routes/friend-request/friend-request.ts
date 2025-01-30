import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { CronJob } from 'cron'
import prisma from '../../prisma/prisma'

const friendRequestRouter = Router()

/**
 * @swagger
 * /friend-request/create:
 *   post:
 *     summary: Create a new friend request
 *     tags:
 *       - Friend Request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID of the user sending the friend request
 *               receiverId:
 *                 type: string
 *                 description: ID of the user receiving the friend request
 *     responses:
 *       201:
 *         description: Friend request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created friend request
 *                 senderId:
 *                   type: string
 *                   description: ID of the user sending the friend request
 *                 receiverId:
 *                   type: string
 *                   description: ID of the user receiving the friend request
 *                 status:
 *                   type: string
 *                   description: Status of the friend request
 *                   enum: [PENDING, ACCEPTED, REJECTED]
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
friendRequestRouter.post('/create', async (req, res) => {
  const { userId } = req.user
  const { friendId } = req.body

  try {
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        status: 'PENDING',
      },
    })
    res.status(201).json(friendRequest)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create friend request' })
  }
})

/**
 * @swagger
 * /friend-request/get:
 *   get:
 *     summary: Get pending friend requests
 *     tags:
 *       - Friend Request
 *     responses:
 *       200:
 *         description: List of pending friend requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the friend request
 *                   senderId:
 *                     type: string
 *                     description: ID of the user sending the friend request
 *                   receiverId:
 *                     type: string
 *                     description: ID of the user receiving the friend request
 *                   status:
 *                     type: string
 *                     description: Status of the friend request
 *                     enum: [PENDING, ACCEPTED, REJECTED]
 *       500:
 *         description: Internal server error
 */
friendRequestRouter.get('/get', async (req, res) => {
  const { userId } = req.user

  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
    })
    res.status(200).json(friendRequests)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friend requests' })
  }
})

/**
 * @swagger
 * /friend-request/accept:
 *   put:
 *     summary: Accept a friend request
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
 *                 description: ID of the friend request to accept
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       500:
 *         description: Internal server error
 */
friendRequestRouter.put('/accept', async (req, res) => {
  const { id } = req.body

  try {
    const friendRequest = await prisma.friendRequest.update({
      where: {
        id,
        status: 'PENDING',
      },
      data: {
        status: 'ACCEPTED',
      },
    })

    if (friendRequest) {
      const job = new CronJob('0 */2 * * *', async () => {
        await prisma.friendRequest.deleteMany({
          where: {
            id,
          },
        })
        job.stop()
      })
      job.start()
    }

    res.status(200).json({ message: 'Friend request accepted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept friend request' })
  }
})

/**
 * @swagger
 * /friend-request/reject:
 *   put:
 *     summary: Reject a friend request
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
 *                 description: ID of the friend request to reject
 *     responses:
 *       200:
 *         description: Friend request rejected
 *       500:
 *         description: Internal server error
 */
friendRequestRouter.put('/reject', async (req, res) => {
  const { id } = req.body

  try {
    const friendRequest = await prisma.friendRequest.updateMany({
      where: {
        id,
        status: 'PENDING',
      },
      data: {
        status: 'REJECTED',
      },
    })

    if (friendRequest.count > 0) {
      const job = new CronJob('0 */2 * * *', async () => {
        await prisma.friendRequest.deleteMany({
          where: {
            id,
            status: 'REJECTED',
          },
        })
        job.stop()
      })
      job.start()
    }

    res.status(200).json({ message: 'Friend request rejected' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject friend request' })
  }
})

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
friendRequestRouter.delete('/withdraw', async (req, res) => {
  const { id } = req.body

  try {
    await prisma.friendRequest.delete({
      where: {
        id,
      },
    })
    res.status(200).json({ message: 'Friend request withdrawn' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to withdraw friend request' })
  }
})

export default friendRequestRouter
