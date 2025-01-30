import express from 'express'
import prisma from '../../prisma/prisma'

const suggestRouter = express.Router()

/**
 * @swagger
 * /suggest:
 *   get:
 *     summary: Get friend suggestions for the logged-in user
 *     tags: [Suggestions]
 *     responses:
 *       200:
 *         description: A list of suggested friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           long:
 *                             type: number
 *                   hobbies:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
suggestRouter.get('/', async (req, res) => {
  const userId = req.user.userId
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        address: {
          select: {
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
            city: true,
            country: true,
            state: true,
            zip: true,
          },
        },
        hobbies: true,
        friends: {
          select: {
            friendId: true,
          },
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const friendIds = user.friends.map(friend => friend.friendId)

    const friendsOfFriends = await prisma.user.findMany({
      where: {
        id: { in: friendIds },
        friends: { some: { friendId: { notIn: friendIds } } },
      },
      select: {
        id: true,
      },
    })

    const friendsOfFriendsIds = friendsOfFriends.map(friend => friend.id)

    const suggestions = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: user.id } },
          { id: { notIn: friendIds } },
          {
            OR: [
              { id: { in: friendsOfFriendsIds } },
              {
                address: {
                  location: {
                    lat: {
                      gte: user.address.location.lat - 5,
                      lte: user.address.location.lat + 5,
                    },
                    long: {
                      gte: user.address.location.long - 5,
                      lte: user.address.location.long + 5,
                    },
                  },
                  city: user.address.city,
                  country: user.address.country,
                  state: user.address.state,
                  zip: user.address.zip,
                },
              },
              { hobbies: { hasSome: user.hobbies } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: {
          select: {
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
            city: true,
            country: true,
            state: true,
            zip: true,
          },
        },
        hobbies: true,
      },
      take: 9,
    })

    res.json(suggestions)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * @swagger
 * /suggest/general:
 *   get:
 *     summary: Get general friend suggestions
 *     tags: [Suggestions]
 *     responses:
 *       200:
 *         description: A list of general suggested friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           long:
 *                             type: number
 *                   hobbies:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
suggestRouter.get('/general', async (req, res) => {
  try {
    const suggestions = await prisma.user.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: {
          select: {
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
          },
        },
        hobbies: true,
      },
      take: 9,
    })

    res.json(suggestions)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default suggestRouter
