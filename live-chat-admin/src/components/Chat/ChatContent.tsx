import React from "react";
import Typography from "@material-ui/core/Typography";
import ChatBox from "./ChatBox";
// import MessagesContext from "../../context/messagesContext";
import Maybe from "graphql/tsutils/Maybe";
import { MeQueryResult } from "../../generated/apolloComponents";

interface Props {
  loading: boolean;
  me: Maybe<MeQueryResult>;
  channelId: string | null;
}

const ChatContent: React.FC<Props> = ({ loading, me, channelId }) => {
  //   const { isLoading, messages, sendMessage } = useContext(MessagesContext);
  return (
    <div>
      <h1>Chat</h1>

      {loading && (
        <div
          style={{
            textAlign: "center"
          }}
        >
          <Typography component="h2" variant="body1">
            Waiting for Chats...
          </Typography>
        </div>
      )}

      {me && me.data && me.data.me && channelId && (
        <ChatBox
          userId={me.data.me.id}
          channelId={channelId}
          // messages={messages}
          // sendMessage={sendMessage}
          // disabled={isLoading}
        />
      )}
    </div>
  );
};

export default ChatContent;
