import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

import { WebSocketLink } from "apollo-link-ws";
import { split, ApolloLink } from "apollo-link";

import { getMainDefinition } from "apollo-utilities";
import { setContext } from "apollo-link-context";
import config from "./config";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const wsLink = new WebSocketLink({
  uri: config.APOLLO_SUBSCRIPTIONS_URI,
  options: {
    reconnect: true
  }
});

const cache = new InMemoryCache({});
const link = new HttpLink({
  uri: config.APOLLO_HTTP_URI,
  credentials: "include"
});

const middlewareLink = setContext(() => ({
  headers: {
    chatToken: localStorage.getItem(ACCESS_TOKEN),
    chatRefreshToken: localStorage.getItem(REFRESH_TOKEN)
  }
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get(ACCESS_TOKEN);
    const refreshToken = headers.get(REFRESH_TOKEN);

    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
    }

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
  }

  return forward(operation);
});

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(link)
);

const combinedLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkWithMiddleware
);

const client = new ApolloClient({
  cache,
  link: combinedLink
});

export default client;
