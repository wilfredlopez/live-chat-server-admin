import React from "react"

import { BrowserRouter, Route, Switch } from "react-router-dom"
import index from "./pages/index"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import Logout from "./pages/logout"
import WithAuthVerify from "./hooksAndHOC/withAuthVerify"

const RouterComponent: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={index} exact />
          <Route path="/dashboard" component={Dashboard} exact />
          <WithAuthVerify>
            <Route path="/chat" component={Chat} exact />
          </WithAuthVerify>

          <Route path="/logout" component={Logout} exact />

          <Route
            path="*"
            render={props => (
              <div>
                <div>Page Not Found</div>
              </div>
            )}
          />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

export default RouterComponent
