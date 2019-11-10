const config = {
  JWT_SECRET: process.env.JWT_SECRET || "SOMESECRETKEY",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  COOKIE_PARSER_SECRET: process.env.COOKIE_PARSER_SECRET || "secretHERE",
  STRIPE_SERCRET_KEY: process.env.STRIPE_SERCRET_KEY || "sk_test_STRIPE_KEY",
  STRIPE_PLAN: "plan_STRIPE_PLAN",
  MONGO_URL: `mongodb+srv://<USERNAME>:<PASSWORD>@cluster0-ef6nu.mongodb.net`,
}

//ALL THIS SHOULD BE AN ENVIROMENT VARIABLE

export default config
