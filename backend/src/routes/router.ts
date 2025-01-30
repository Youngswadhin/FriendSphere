import express from 'express'

import authRouter from './auth/auth-route'
import friendRequestRouter from './friend-request/friend-request'
import searchRouter from './search/search'
import suggestRouter from './suggest/suggest'
import friendRouter from './friend/friend'

import { serve, setup } from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerSpec = swaggerJSDoc({
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
})

const router = express.Router()

router.use('/auth', authRouter)
router.use('/friend-request', friendRequestRouter)
router.use('/search', searchRouter)
router.use('/suggest', suggestRouter)
router.use('/friend', friendRouter)

router.use('/api-docs', serve, setup(swaggerSpec))

export default router
