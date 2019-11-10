import { gql } from "apollo-boost"

export const channelMessageNotificationSubscription = gql`
  subscription ChannelMessageNotificationSubscription($channelId: ID!) {
    channelMessageNotification(channelId: $channelId) {
      id
      message
      date

      user {
        id
        name
        email
        avatar
        firstName
        lastName
      }
    }
  }
`
