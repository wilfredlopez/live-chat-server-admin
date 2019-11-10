import { gql } from "apollo-boost"

export const guestMeQuery = gql`
  query GuestMeQuery {
    guestMe {
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
