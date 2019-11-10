import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"

import { WebSocketLink } from "apollo-link-ws"
import { split, ApolloLink } from "apollo-link"

import { getMainDefinition } from "apollo-utilities"
import { setContext } from "apollo-link-context"

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4500/subscriptions`,
  options: {
    reconnect: true,
  },
})

const cache = new InMemoryCache({})
const link = new HttpLink({
  uri: "http://localhost:4500/graphql",
  credentials: "include",
})

const middlewareLink = setContext(() => ({
  headers: {
    "access-token": localStorage.getItem("token"),
    "refresh-token": localStorage.getItem("refreshToken"),
  },
}))

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext()

  if (headers) {
    const token = headers.get("access-token")
    const refreshToken = headers.get("refresh-token")

    if (token) {
      localStorage.setItem("token", token)
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
  }

  return forward(operation)
})

const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(link))

const combinedLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLinkWithMiddleware,
)

const client = new ApolloClient({
  cache,
  link: combinedLink,
})

export default client
