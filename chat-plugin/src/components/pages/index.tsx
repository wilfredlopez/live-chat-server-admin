import * as React from "react"
import Chat from "./Chat"
import ChatIcon from "../Chat/ChatIcon"
import {
  useGuestMeQueryQuery,
  useSendMessageMutaionMutation,
  useChannelMessageNotificationSubscriptionSubscription,
  GuestMeQueryQueryResult,
} from "../../generated/apolloComponents"
import Login from "../login"
import MessagesContext, { Imessage } from "../context/messagesContext"

interface IIndexProps {}

const Index: React.FunctionComponent<IIndexProps> = props => {
  const [messages, setMessages] = React.useState<Imessage[]>([])
  const [sendMessageMutation, sendingData] = useSendMessageMutaionMutation()
  const me = useGuestMeQueryQuery()

  const sendMessage = async (
    event: React.FormEvent<HTMLFormElement>,
    text: string,
    channelId: string,
    userId: string,
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
        fetchPolicy: "no-cache",
      })
    }
  }

  return (
    <MessagesContext.Provider
      value={{
        sendMessage,
        setMessages: setMessages,
        messages: messages,
        isLoading: sendingData.loading,
      }}
    >
      <IndexContent me={me} />
    </MessagesContext.Provider>
  )
}

interface IIndexContentProps {
  me: GuestMeQueryQueryResult
}

const IndexContent: React.FunctionComponent<IIndexContentProps> = ({ me }) => {
  const [open, setOpen] = React.useState(false)

  const { setMessages, messages } = React.useContext(MessagesContext)
  // const me = useGuestMeQueryQuery()

  const {
    data,
    loading,
  } = useChannelMessageNotificationSubscriptionSubscription({
    variables: {
      channelId: me.data && me.data.guestMe ? me.data.guestMe.channelId : "",
    },
  })

  React.useEffect(() => {
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

  const chatIconComponent = (
    <ChatIcon handleClick={() => setOpen(value => !value)} open={open} />
  )

  if (me && me.data && !me.data.guestMe) {
    return open ? <Login /> : chatIconComponent
  }

  if (open && me && me.data && me.data.guestMe) {
    return (
      <>
        <Chat
          userId={me.data.guestMe.id}
          channelId={me.data.guestMe.channelId}
          susbcriptionLoading={loading}
          close={() => setOpen(c => !c)}
        />{" "}
        {chatIconComponent}
      </>
    )
  } else {
    return chatIconComponent
  }
}

export default Index
