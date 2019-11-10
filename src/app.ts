import { ApolloServer } from "apollo-server-express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors, { CorsOptions } from "cors"
import express from "express"
// import path from "path"
import { buildSchema } from "type-graphql"
import { createConnection } from "typeorm"
// import config from "./config"
import createBulkProducts from "./customRoutes/createBulkProducts"
import { userLoader } from "./dataloaders/dataloaders"
import { authMiddleware } from "./midleware/authMidleware"
import FilesResolver from "./resolvers/fileUpload/fileUploadResolver"
import ChangeForgotPasswordResolver from "./resolvers/user/changeForgotPasswordResolver"
import { customAuthChecker } from "./resolvers/user/customAuthChecket"
import UserResolver from "./resolvers/user/userResolver"
import { MyContext } from "./schema/MyContext"
import ChannelResolver from "./resolvers/channels/channelResolver"
import { PubSub } from "graphql-subscriptions"
import { SubscriptionServer } from "subscriptions-transport-ws"
import { createServer } from "http"
// import { redis } from "./redis";
// import connectRedis from "connect-redis";
import { execute, subscribe } from "graphql"
import MessageResolver from "./resolvers/message/messageResolver"
import GuestResolver from "./resolvers/Guest/guestResolver"
import config from "./config"
import { url } from "inspector"
// const RedisStore = connectRedis(session);

const allowedOrigins = [
  "https://shop-client.cubamc.now.sh", // new Zeit Now production build
  "https://testing-cookies-wilfred.herokuapp.com",
  "http://justretailme.herokuapp.com",
  "http://retailme.wilfredlopez.net",
  "http://localhost:3000",
  "http://localhost:4000",
  "https://justretailmeserver.herokuapp.com",
  "http://justretailmeserver.herokuapp.com",
  "https://justretailme.herokuapp.com",
]

const app = async () => {
  const app: express.Application = express()

  const corsOptions: CorsOptions = {
    origin: allowedOrigins,

    credentials: true, // <-- REQUIRED backend setting
  }

  app.use(cors(corsOptions))
  app.use(cookieParser())

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )
  app.use(bodyParser.json())

  const dbName = process.env.DATABASE_NAME || "live-chat-server-dev"
  const mongoUrl = process.env.MONGO_URL || config.MONGO_URL

  const MongoURI = `${mongoUrl}/${dbName}`

  await createConnection({
    name: "default",
    type: "mongodb",
    port: 27017,
    // port: parseInt(process.env.PORT || "27017", 10),
    url: MongoURI,
    database: dbName,
    synchronize: true,
    // dropSchema: true,
    logging: true,
    useNewUrlParser: true,
    entities: [`${__dirname}/entity/**/*.*`],
    migrations: [`${__dirname}/migration/**/*.*`],
    subscribers: [`${__dirname}/subscriber/**/*.*`],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
    validateOptions: {
      useUnifiedTopology: true,
    },
  }).then(() => console.log("Connected to database"))

  app.use(authMiddleware)
  const pubsub = new PubSub()

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ChangeForgotPasswordResolver,
      ChangeForgotPasswordResolver,
      ChannelResolver,
      FilesResolver,
      MessageResolver,
      GuestResolver,
    ],
    pubSub: pubsub,
    // resolvers: [__dirname + "/resolvers/**/*.ts"],
    authChecker: customAuthChecker,
    emitSchemaFile: true,

    // or create the file with schema in selected path
  })

  const server = new ApolloServer({
    schema,
    subscriptions: { path: "/subscriptions" },
    context: ({ req, res }: MyContext) => ({
      req,
      res,
      userLoader: userLoader(),
    }),
    introspection: true,
    playground: true, //anable in production for tests
  })

  server.applyMiddleware({ app, cors: false, bodyParserConfig: false }) // app is from an existing express app

  app.post("/api/products/bulk", createBulkProducts)

  //  FONTEND-CLIENT CODE ****************************
  //serving static files from  frontend
  // app.use(
  //   "/static",
  //   express.static(
  //     path.join(__dirname, "..", "admin-client", "build", "static"),
  //   ),
  // )

  //serving frontend folder
  // app.use(
  //   "/static",
  //   express.static(path.join(__dirname, "..", "admin-client", "build")),
  // )

  // app.use("/public", express.static(path.join(__dirname, "..", "static")))

  // app.get("*", (req: Request, res: Response) => {
  //   res.sendFile(
  //     path.join(__dirname, "..", "admin-client", "build", "index.html"),
  //   )
  // })

  //************************ */

  const port = process.env.PORT || 4500

  const ws = createServer(app)
  ws.listen(port, () => {
    console.log(`Apollo Server is now running on http://localhost:${port}`)
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: ws,

        path: "/subscriptions",
      },
    )
  })

  // app.listen({ port }, () =>
  //   console.log(`Ready at http://localhost:${port}/graphql`),
  // )
}

export default app
