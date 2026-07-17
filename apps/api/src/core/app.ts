import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import morganMiddleware from './middlewares/morganMiddleware'
import rateLimitingMiddleware from './middlewares/rateLimitingMiddleware'
import router from './routes'
import { CORS_ALLOWED_ORIGINS } from './routes/constants/corsAllowedOrigins'

const app = express()

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    xPoweredBy: false,
    xXssProtection: false
  })
)

// CORS configuration with credentials support
app.use(
  cors({
    origin: CORS_ALLOWED_ORIGINS,
    credentials: true
  })
)

// Cookie parser
app.use(cookieParser())

// Body parsers
app.use(express.raw())
app.use(express.json({ limit: '50mb' }))

// HTTP request logger
app.use(morganMiddleware)

// Rate limiting
app.use(rateLimitingMiddleware)

app.use('/', router)

export default app
