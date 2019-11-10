import dotenv from "dotenv"

dotenv.config()
let path
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`
    break
  case "production":
    path = `${__dirname}/../../.env.production`
    break
  default:
    path = `${__dirname}/../../.env.development`
}
dotenv.config({ path: path })

export const DATABASE_NAME = process.env.DATABASE_NAME
export const MONGO_URL = process.env.MONGO_URL
export const JWT_SECRET = process.env.JWT_SECRET

export const FRONTEND_URL = process.env.FRONTEND_URL

// export const COOKIE_PARSER_SECRET = process.env.COOKIE_PARSER_SECRET
// export const STRIPE_SERCRET_KEY = process.env.STRIPE_SERCRET_KEY
// export const STRIPE_PLAN = process.env.STRIPE_PLAN
