import express from 'express'
import { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import router from './routes/router'
import cors from 'cors'
import { authGuard } from './middleware/auth-middleware'
import cookieParser from 'cookie-parser'

export const app = express()

// Custom error handler
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
}

// Default route
function defaultRoute(req: Request, res: Response, next: NextFunction) {
  res.sendStatus(404)
}

// @ts-ignore
app.use(bodyParser.json())
// @ts-ignore
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('tiny'))
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(cookieParser())

app.use(authGuard)
app.use('/', router)

app.use(defaultRoute) // default route has to be last route
app.use(errorHandler) // Error handler goes last