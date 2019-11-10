import React from "react"
import Login from "../components/login/login"
import { Container } from "@material-ui/core"
import { RouteComponentProps } from "react-router-dom"

interface Props extends RouteComponentProps {}

const index: React.FC<Props> = props => {
  return (
    <Container>
      <Login {...props} />
    </Container>
  )
}

export default index
