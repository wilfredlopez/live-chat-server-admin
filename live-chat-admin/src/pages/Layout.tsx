import React, { Component } from "react"
import Header from "../components/Layout/Header"
import { Container } from "@material-ui/core"

class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <Container maxWidth="xl">{this.props.children}</Container>
      </>
    )
  }
}

export default Layout
