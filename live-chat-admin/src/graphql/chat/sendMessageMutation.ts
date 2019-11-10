import { gql } from "apollo-boost"

export const sendMessageMutation = gql`
  mutation SendMessageMutaion(
    $text: String!
    $channelId: String!
    $userId: String!
  ) {
    sendMessage(
      messageInput: { text: $text, channelId: $channelId, userId: $userId }
    ) {
      id
      message
      userId
      channelId
      user {
        id
        name
        avatar
        email
      }
    }
  }
`
