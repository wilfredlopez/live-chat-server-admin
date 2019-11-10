import React, { useState } from "react"
import { MeQueryResult, MeQueryVariables } from "../generated/apolloComponents"
import { Redirect, RouteProps } from "react-router"
import { Query } from "react-apollo"
import { meQuery } from "../graphql/user/query/meQuery"

type IProps = RouteProps

const WithAuthVerify: React.FunctionComponent<IProps> = props => {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <React.Fragment>
      <Query<MeQueryResult, MeQueryVariables> query={meQuery}>
        {result => {
          if (!result.loading && result.data && result.data !== null) {
            // console.log(result.data)
            const { me }: any = result.data
            try {
              if (me.email) {
                setLoggedIn(true)
              }
            } catch (error) {
              return (
                <Redirect
                  to={{
                    pathname: "/",
                    state: {
                      next: props.location!.pathname || "/dashboard",
                    },
                  }}
                />
              )
            }
          }

          return loggedIn ? (
            <React.Fragment>{props.children}</React.Fragment>
          ) : (
            <div>Loading...</div>
          )
        }}
      </Query>
    </React.Fragment>
  )
}

export default WithAuthVerify
