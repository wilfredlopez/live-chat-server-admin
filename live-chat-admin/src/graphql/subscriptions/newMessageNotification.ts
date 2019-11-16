import { gql } from "apollo-boost";

export const newMessageSubscription = gql`
  subscription NewMessageSubscription {
    newMessageNotification {
      id
      message
      date
      channelId
      user {
        id
        name
        avatar
        email
      }
    }
  }
`;
