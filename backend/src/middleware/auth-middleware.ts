import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import get from 'lodash/get'

const protectedRoutes = [
  '/auth/update',
  '/auth/update-password',
  '/friend-request/create',
  '/friend-request/get',
  '/friend-request/accept',
  '/friend-request/reject',
  '/suggest',
  '/search',
]
interface DecodedToken {
  userId: string
  iat: number
  exp: number
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedToken
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  if (protectedRoutes.includes(req.path)) {
    const token = get(req, 'cookies.jwt')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          return res.status(401).json({ error: 'Failed to authenticate token' })
        }
        req.user = decoded as DecodedToken
        next()
      })
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    next()
  }
}
