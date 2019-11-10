import React from "react"
import RouterComponent from "./router"
import { ThemeProvider } from "@material-ui/styles"
import { CssBaseline } from "@material-ui/core"
import theme from "./theme"
import { ApolloProvider } from "react-apollo"
import client from "./apollo"

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterComponent />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
