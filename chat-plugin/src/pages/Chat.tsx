import React, { useState, useEffect } from "react"
import ChatBox from "../components/Chat/ChatBox"
import {
  User,
  Maybe,
  useSendMessageMutaionMutation,
  useChannelMessageNotificationSubscriptionSubscription,
} from "../generated/apolloComponents"
import { Typography } from "@material-ui/core"
// const chat: Imessage[] = [
//   {
//     id: "asdsdsd",
//     message: "Initial Text",
//     date: new Date(Date.now()),

//     user: {
//       id: "sdfadsd",
//       name: "Wilfred",
//       avatar:
//         "https://cdn4.vectorstock.com/i/1000x1000/77/43/young-man-head-avatar-cartoon-face-character-vector-21757743.jpg",
//       email: "wilfred@wilfred.com",
//     },
//   },
// ]

export interface Imessage {
  id: string
  message: string
  date: Date

  user?: Maybe<Pick<User, "name" | "id" | "avatar" | "email">>
}

interface Props {
  userId: string
  channelId: string
}

const Chat: React.FC<Props> = ({ userId, channelId }) => {
  const [sendMessageMutation] = useSendMessageMutaionMutation()
  const [messages, setMessages] = useState<Imessage[]>([])

  const {
    data,
    loading,
  } = useChannelMessageNotificationSubscriptionSubscription({
    variables: {
      channelId: channelId,
    },
  })

  useEffect(() => {
    if (data && data.channelMessageNotification) {
      const newMessage: Imessage = {
        date: data.channelMessageNotification.date,
        id: data.channelMessageNotification.id,
        message: data.channelMessageNotification.message,
        user: data.channelMessageNotification.user,
      }

      const updatedMessages = [...messages]
      updatedMessages.push(newMessage)
      setMessages(updatedMessages)
    }
    // eslint-disable-next-line
  }, [data])

  const sendMessage = async (
    event: React.FormEvent<HTMLFormElement>,
    text: string,
  ) => {
    event.preventDefault()
    // console.log(event.target)

    if (channelId) {
      await sendMessageMutation({
        variables: {
          text: text,
          channelId: channelId,
          userId: userId,
        },
      })
    }
  }

  return (
    <div className="chat-container-class">
      {/* <Container maxWidth="sm"> */}
      <Typography component="h1" variant="h4" align="center">
        Chat
      </Typography>

      {loading && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Typography component="h2" variant="body1">
            We are ready to talk to you!
          </Typography>
        </div>
      )}

      <ChatBox messages={messages} sendMessage={sendMessage} disabled={false} />

      {/* </Container> */}
    </div>
  )
}

export default Chat
