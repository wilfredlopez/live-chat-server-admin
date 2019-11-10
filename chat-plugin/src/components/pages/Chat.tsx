import { Typography } from "@material-ui/core"
import React, { useContext } from "react"

import ChatBox from "../Chat/ChatBox"
import MessagesContext from "../context/messagesContext"
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

interface Props {
  userId: string
  channelId: string
  susbcriptionLoading?: boolean
}

const Chat: React.FC<Props> = ({
  userId,
  channelId,
  susbcriptionLoading = false,
}) => {
  // const [sendMessageMutation, sendingData] = useSendMessageMutaionMutation()
  // const [messages, setMessages] = useState<Imessage[]>([])
  const { sendMessage, messages, isLoading } = useContext(MessagesContext)

  // const {
  //   data,
  //   loading,
  // } = useChannelMessageNotificationSubscriptionSubscription({
  //   variables: {
  //     channelId: channelId,
  //   },
  // })

  // useEffect(() => {
  //   if (data && data.channelMessageNotification) {
  //     const newMessage: Imessage = {
  //       date: data.channelMessageNotification.date,
  //       id: data.channelMessageNotification.id,
  //       message: data.channelMessageNotification.message,
  //       user: data.channelMessageNotification.user,
  //     }

  //     const updatedMessages = [...messages]
  //     updatedMessages.push(newMessage)
  //     setMessages(updatedMessages)
  //   }
  //   // eslint-disable-next-line
  // }, [data])

  // const sendMessage = async (
  //   event: React.FormEvent<HTMLFormElement>,
  //   text: string,
  // ) => {
  //   event.preventDefault()
  //   // console.log(event.target)

  //   if (channelId) {
  //     await sendMessageMutation({
  //       variables: {
  //         text: text,
  //         channelId: channelId,
  //         userId: userId,
  //       },
  //     })
  //   }
  // }

  return (
    <div className="chat-container-class">
      {/* <Container maxWidth="sm"> */}
      <Typography component="h1" variant="h4" align="center">
        Chat
      </Typography>
      {susbcriptionLoading && (
        <Typography component="h2" variant="body2" align="center">
          Thanks for chatting. How can i help?
        </Typography>
      )}
      <ChatBox
        messages={messages}
        handleMessage={(e, text) => sendMessage(e, text, channelId, userId)}
        // disabled={sendingData.loading}
        disabled={isLoading}
        currentUserId={userId}
      />

      {/* </Container> */}
    </div>
  )
}

export default Chat
