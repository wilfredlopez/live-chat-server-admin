import React, { useEffect } from "react"
import { useLogoutMutationMutation } from "../generated/apolloComponents"
import { RouteComponentProps } from "react-router-dom"

interface Props extends RouteComponentProps {}

const Logout: React.FC<Props> = props => {
  const [logout] = useLogoutMutationMutation()

  useEffect(() => {
    async function logoutAndRedirect() {
      await logout()

      props.history.replace("/")
    }
    logoutAndRedirect()
  }, [props.history, logout])
  return <div></div>
}

export default Logout
