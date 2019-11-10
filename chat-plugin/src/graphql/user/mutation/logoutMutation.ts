import { gql } from "apollo-boost"

export const logoutMutation = gql`
  mutation LogoutMutation {
    logout
  }
`
