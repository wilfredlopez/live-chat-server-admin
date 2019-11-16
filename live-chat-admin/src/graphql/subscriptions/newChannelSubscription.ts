import { gql } from "apollo-boost";

export const newChannelNotificationSubscription = gql`
  subscription NewChannelNotificationSubscription {
    newChannelNotification {
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

// export const newMessageSubscription = gql`
//   subscription NewMessageSubscription {
//     newMessageNotification {
//       id
//       message
//       date
//       channelId
//       user {
//         id
//         name
//         avatar
//         email
//       }
//     }
//   }
// `;
