> - first create a folder - mkdir folder_name
> - then cmd - npm init
> - then add a src folder
> - then add a server.js in src
> - add a readme.md file
> - make your first commit s initial setup 🌱
> - then in your package.json add in dependencies
>   ```
>   "@prisma/client": "^6.2.1",
>   "@types/express": "^4.17.0",
>   "@types/node": "^12.0.4",
>   "cors": "^2.8.5",
>   "express": "^4.17.1",
>   "jsonwebtoken": "^9.0.2",
>   "morgan": "^1.9.1",
>   "typescript": "^3.5.1"
>   ```
> - then in your package.json add in devDependencies
>   ```
>   "eslint": "^5.16.0",
>   "eslint-config-prettier": "^4.3.0",
>   "eslint-plugin-prettier": "^3.1.0",
>   "tslint": "^5.17.0",
>   "tslint-config-airbnb": "^5.11.1",
>   "typescript": "^5.2.2"
>   ```
> - then add this in last of the file
>   ```
>   "prisma": {
>       "schema": "./src/prisma/schema.prisma"
>   }
>   ```
> - then add this in scripts removing all previous
>   ```
>   "dev": "nodemon --exec ts-node ./src/server.ts",
>   "start": "node ./dist/server.js",
>   ```
> - then copy .env, .eslintrc.js, .gitignore, .prettierrc, tsconfig.json
> - add the code from server.ts to yours
> - then create a app.ts file and write below
>
>   ```
>   import express from 'express'
>   import { Request, Response, NextFunction } from 'express'
>   import * as bodyParser from 'body-parser'
>   import morgan from 'morgan'
>   import cors from 'cors'
>   import cookieParser from 'cookie-parser'
>
>   export const app = express()
>
>   // Custom error handler
>   function errorHandler(err: Error, req: Request, res: Response, next: >NextFunction) {
>   console.error(err.stack)
>   res.status(500).json({ error: err.message })
>   }
>
>   // Default route
>   function defaultRoute(req: Request, res: Response, next: NextFunction) {
>   res.sendStatus(404)
>   }
>
>   app.use(bodyParser.json())
>   app.use(bodyParser.urlencoded({ extended: false }))
>   app.use(morgan('tiny'))
>   app.use(cors())
>   app.use(cookieParser())
>
>   app.use(defaultRoute) // default route has to be last route
>   app.use(errorHandler) // Error handler goes last
>   ```
>
> - copy the prisma folder
> - then make your second commit - added schema & basic router setup
> - then copy routes folder
> - then copy all app.ts content to yours
> - then copy middleware
> - then write the final commit as completed apis with swagger docs in it
