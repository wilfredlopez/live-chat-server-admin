const config = {
  JWT_SECRET: process.env.JWT_SECRET || "WSDKSLJFS8303r908098sjd",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  COOKIE_PARSER_SECRET:
    process.env.COOKIE_PARSER_SECRET || "secretparsercookies",
  STRIPE_SERCRET_KEY:
    process.env.STRIPE_SERCRET_KEY ||
    "sk_test_6IAo2GjExeLeqGbOhbnUAQDA00CQvmrEFS",
  STRIPE_PLAN: "plan_Fm5R7HrA95ySVP",
  MONGO_URL: `mongodb+srv://listenupstreet:Wilfred2988@cluster0-ef6nu.mongodb.net`,
}

//ALL THIS SHOULD BE AN ENVIROMENT VARIABLE

export default config
