import React, { useState, useEffect } from "react"
import ChatBox from "../components/Chat/ChatBox"
import {
  useNewMessageSubscriptionSubscription,
  User,
  Maybe,
  useSendMessageMutaionMutation,
  useMeQuery,
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

interface Props {}

const Chat: React.FC<Props> = () => {
  const [sendMessageMutation] = useSendMessageMutaionMutation()
  const [messages, setMessages] = useState<Imessage[]>([])
  const [channelId, setChannelId] = useState<string | null>(null)
  const me = useMeQuery()

  const { data, loading } = useNewMessageSubscriptionSubscription()

  useEffect(() => {
    if (data && data.newMessageNotification) {
      const newMessage: Imessage = {
        date: data.newMessageNotification.date,
        id: data.newMessageNotification.id,
        message: data.newMessageNotification.message,
        user: data.newMessageNotification.user,
      }

      const updatedMessages = [...messages]
      setChannelId(data.newMessageNotification.id)
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

    if (me.data && me.data.me && channelId) {
      await sendMessageMutation({
        variables: {
          text: text,
          channelId: channelId,
          userId: me.data.me.id,
        },
      })
    }
  }

  return (
    <div>
      <h1>Chat</h1>

      {loading && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Typography component="h2" variant="body1">
            Waiting for Chats...
          </Typography>
        </div>
      )}

      <ChatBox
        messages={messages}
        sendMessage={sendMessage}
        disabled={loading}
      />
    </div>
  )
}

export default Chat
