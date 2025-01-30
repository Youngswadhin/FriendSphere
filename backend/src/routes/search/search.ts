import { PrismaClient } from '@prisma/client'
import express from 'express'
import prisma from '../../prisma/prisma'

const searchRouter = express.Router()

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
  const { userId } = req.user
  const searchString = req.query.string as string

  try {
    const users = await prisma.user.findMany({
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
    })
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default searchRouter
