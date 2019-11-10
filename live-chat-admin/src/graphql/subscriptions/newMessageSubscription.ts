import { gql } from "apollo-boost"

export const newMessageSubscription = gql`
  subscription NewMessageSubscription {
    newMessageNotification {
      id
      message
      date
      user {
        id
        name
        avatar
        email
      }
    }
  }
`
