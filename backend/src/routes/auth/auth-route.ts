import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import prisma from '../../prisma/prisma'
import get from 'lodash/get'

const authRouter = Router()

const generateToken = (user: any) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '10d' })
}

const signUpSchema = z.object({
  name: z.string(),
  age: z.number().min(0),
  password: z.string().min(6),
  email: z.string().email(),
  address: z.object({
    city: z.string(),
    zip: z.number(),
    country: z.string(),
    state: z.string(),
    location: z.object({
      lat: z.number(),
      long: z.number(),
    }),
  }),
  hobbies: z.array(z.string()),
  image: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const updateSchema = z.object({
  name: z.string().optional(),
  age: z
    .number()
    .min(0)
    .optional(),
  email: z
    .string()
    .email()
    .optional(),
  address: z
    .object({
      city: z.string().optional(),
      zip: z.number().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      location: z
        .object({
          lat: z.number().optional(),
          long: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  hobbies: z.array(z.string()).optional(),
  image: z.string().optional(),
})

const passwordUpdateSchema = z.object({
  password: z.string().min(6),
})

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: John Doe
 *               age:
 *                 type: number
 *                 description: The age of the user.
 *                 example: 25
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: password123
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: johndoe@example.com
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The city of the user's address.
 *                     example: New York
 *                   zip:
 *                     type: number
 *                     description: The zip code of the user's address.
 *                     example: 10001
 *                   country:
 *                     type: string
 *                     description: The country of the user's address.
 *                     example: USA
 *                   state:
 *                     type: string
 *                     description: The state of the user's address.
 *                     example: NY
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         description: The latitude of the user's location.
 *                         example: 40.7128
 *                       long:
 *                         type: number
 *                         description: The longitude of the user's location.
 *                         example: -74.0060
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The hobbies of the user.
 *                 example: ["reading", "swimming"]
 *               image:
 *                 type: string
 *                 description: The profile image URL of the user.
 *                 example: http://example.com/image.jpg
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */

authRouter.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body)
    const { name, age, password, email, address, hobbies, image } = validatedData

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        age,
        password: hashedPassword,
        email,
        address: {
          create: {
            city: address.city,
            zip: address.zip || 0,
            country: address.country,
            state: address.state,
            location: {
              create: {
                lat: address.location.lat,
                long: address.location.long,
              },
            },
          },
        },
        hobbies,
        image ,
      },
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        address: {
          select: {
            city: true,
            zip: true,
            country: true,
            state: true,
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
          },
        },
        hobbies: true,
        image: true,
        receivedRequests: {
          select: {
            sender: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
        sentRequests: {
          select: {
            receiver: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
      },
    })

    const token = generateToken(user)
    res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true })
    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Bad request
 */
authRouter.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        password: true,
        address: {
          select: {
            city: true,
            zip: true,
            country: true,
            state: true,
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
          },
        },
        hobbies: true,
        image: true,
        receivedRequests: {
          select: {
            sender: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
        sentRequests: {
          select: {
            receiver: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
      },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { password: Password, ...restUser } = user

    const token = generateToken(user)
    res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true })
    res.status(200).json({ user: restUser, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get authenticated user details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
authRouter.get('/', async (req, res) => {
  const token = get(req, 'cookies.jwt')

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    console.log(decoded)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        address: {
          select: {
            city: true,
            zip: true,
            country: true,
            state: true,
            location: {
              select: {
                lat: true,
                long: true,
              },
            },
          },
        },
        hobbies: true,
        image: true,
        receivedRequests: {
          where: { receiverId: decoded.userId },
          select: {
            sender: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
        sentRequests: {
          where: { senderId: decoded.userId },
          select: {
            receiver: {
              select: {
                name: true,
                image: true,
              },
            },
            status: true,
            id: true,
          },
        },
        friends: {
          select: {
            friend: {
              select: {
                name: true,
                image: true,
                id: true,
                },
                },
              
                },
              },
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.clearCookie('jwt')
      return res.status(401).json({ error: 'Token expired' })
    }
    res.status(400).json({ error: error.message })
  }
})

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 */
authRouter.post('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({ message: 'User logged out successfully' })
})

/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update authenticated user details
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *                 example: John Doe
 *               age:
 *                 type: number
 *                 description: The age of the user.
 *                 example: 25
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *                 example: johndoe@example.com
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The city of the user's address.
 *                     example: New York
 *                   zip:
 *                     type: number
 *                     description: The zip code of the user's address.
 *                     example: 10001
 *                   country:
 *                     type: string
 *                     description: The country of the user's address.
 *                     example: USA
 *                   state:
 *                     type: string
 *                     description: The state of the user's address.
 *                     example: NY
 *                   location:
 *                     type: object
 *                     properties:
 *                       lat:
 *                         type: number
 *                         description: The latitude of the user's location.
 *                         example: 40.7128
 *                       long:
 *                         type: number
 *                         description: The longitude of the user's location.
 *                         example: -74.0060
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The hobbies of the user.
 *                 example: ["reading", "swimming"]
 *               image:
 *                 type: string
 *                 description: The profile image URL of the user.
 *                 example: http://example.com/image.jpg
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Not authenticated
 *       400:
 *         description: Bad request
 */
authRouter.put('/update', async (req, res) => {
  try {
    console.log(req.user)
    const { userId } = req.user
    const validatedData = updateSchema.parse(req.body)
    const { name, age, email, address, hobbies, image } = validatedData

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        age,
        email,
        address: {
          update: {
            city: address.city,
            zip: address.zip,
            country: address.country,
            state: address.state,
            location: {
              update: {
                lat: address.location ? address.location.lat : undefined,
                long: address.location ? address.location.long : undefined,
              },
            },
          },
        },
        hobbies,
        image,
      },
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * /auth/update-password:
 *   put:
 *     summary: Update user password
 *     description: Updates the password of the user identified by the decoded userId.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
authRouter.put('/password-update', async (req, res) => {
  try {
    const { userId } = req.user
    const validatedData = passwordUpdateSchema.parse(req.body)
    const { password } = validatedData

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default authRouter