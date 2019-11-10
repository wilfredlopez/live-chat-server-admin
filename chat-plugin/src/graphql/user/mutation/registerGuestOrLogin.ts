import { gql } from "apollo-boost"

export const registerGuestOrLoginMutation = gql`
  mutation RegisterGuestOrLoginMutation(
    $email: String!
    $firstname: String!
    $lastname: String!
  ) {
    registerGuestOrLogin(
      guestInputType: {
        email: $email
        firstname: $firstname
        lastname: $lastname
      }
    ) {
      id
      channelId
      name
      email
      avatar
      firstName
      lastName
    }
  }
`
