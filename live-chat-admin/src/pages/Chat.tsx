import React, { useState, useEffect, useContext } from "react";
// import ChatBox from "../components/Chat/ChatBox"
import {
  useNewChannelNotificationSubscriptionSubscription,
  User,
  Maybe,
  useSendMessageMutaionMutation,
  useMeQuery,
  useNewMessageSubscriptionSubscription
} from "../generated/apolloComponents";
// import { Typography } from "@material-ui/core"
import ChatContent from "../components/Chat/ChatContent";
import MessagesContext from "../context/messagesContext";
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
  id: string;
  message: string;
  date: Date;

  user?: Maybe<Pick<User, "name" | "id" | "avatar" | "email">>;
}

interface Props {}

const Chat: React.FC<Props> = () => {
  // const [sendMessageMutation] = useSendMessageMutaionMutation();
  // const [messages, setMessages] = useState<Imessage[]>([]);
  const { setMessages, messages } = useContext(MessagesContext);
  const [channelId, setChannelId] = useState<string | null>(null);
  const me = useMeQuery();

  const { data, loading } = useNewChannelNotificationSubscriptionSubscription();

  const newMessageSub = useNewMessageSubscriptionSubscription();

  useEffect(() => {
    //sets the channel id and message when a new channel is created and if channelId is currently null
    if (!channelId) {
      if (data && data.newChannelNotification) {
        const newMessage: Imessage = {
          date: data.newChannelNotification.date,
          id: data.newChannelNotification.id,
          message: data.newChannelNotification.message,
          user: data.newChannelNotification.user
        };

        const updatedMessages = [...messages];
        setChannelId(data.newChannelNotification.channelId);
        updatedMessages.push(newMessage);
        setMessages(updatedMessages);
      }
    }
    // eslint-disable-next-line
  }, [data, channelId]);

  useEffect(() => {
    //updates the messages when user sends a message to the current channelId
    if (channelId) {
      if (newMessageSub.data && newMessageSub.data.newMessageNotification) {
        const newMessage: Imessage = {
          date: newMessageSub.data.newMessageNotification.date,
          id: newMessageSub.data.newMessageNotification.id,
          message: newMessageSub.data.newMessageNotification.message,
          user: newMessageSub.data.newMessageNotification.user
        };

        const updatedMessages = [...messages];
        // setChannelId(newMessageSub.data.newMessageNotification.channelId);
        updatedMessages.push(newMessage);
        setMessages(updatedMessages);
      }
    }
    // eslint-disable-next-line
  }, [newMessageSub.data]);

  // const sendMessage = async (
  //   event: React.FormEvent<HTMLFormElement>,
  //   text: string
  // ) => {
  //   event.preventDefault();
  //   // console.log(event.target)

  //   if (me.data && me.data.me && channelId) {
  //     await sendMessageMutation({
  //       variables: {
  //         text: text,
  //         channelId: channelId,
  //         userId: me.data.me.id
  //       }
  //     });
  //   }
  // };

  if (me.data && me.data.me) {
    return <ChatContent loading={loading} me={me} channelId={channelId} />;
  }

  return (
    <div>Loading...</div>
    // <div>
    //   <h1>Chat</h1>

    //   {loading && (
    //     <div
    //       style={{
    //         textAlign: "center",
    //       }}
    //     >
    //       <Typography component="h2" variant="body1">
    //         Waiting for Chats...
    //       </Typography>
    //     </div>
    //   )}

    //   <ChatBox
    //     messages={messages}
    //     sendMessage={sendMessage}
    //     disabled={loading}
    //   />
    // </div>
  );
};

const ChatContainer = () => {
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [sendMessageMutation, sendingData] = useSendMessageMutaionMutation();

  const sendMessage = async (
    event: React.FormEvent<HTMLFormElement>,
    text: string,
    channelId: string,
    userId: string
  ) => {
    event.preventDefault();
    // console.log(event.target)

    if (channelId) {
      await sendMessageMutation({
        variables: {
          text: text,
          channelId: channelId,
          userId: userId
        },
        fetchPolicy: "no-cache"
      });
    }
  };

  return (
    <MessagesContext.Provider
      value={{
        sendMessage,
        setMessages: setMessages,
        messages: messages,
        isLoading: sendingData.loading
      }}
    >
      <Chat />
    </MessagesContext.Provider>
  );
};

export default ChatContainer;
