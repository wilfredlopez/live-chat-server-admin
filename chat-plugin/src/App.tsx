import React from "react";

// import { ThemeProvider } from "@material-ui/core/styles";
// import { CssBaseline } from "@material-ui/core";
// import theme from "./theme";
import { ApolloProvider } from "react-apollo";
import client from "./apollo";
// import "./css/chat.css"
import "./css/wilchat.css";
// import "./css/base.css";

import Index from "./components/pages";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      {/* <ThemeProvider theme={theme}> */}
      {/* <CssBaseline /> */}
      <Layout>
        <Index />
      </Layout>
      {/* </ThemeProvider> */}
    </ApolloProvider>
  );
};

export default App;
