import React, { useState, useRef, useLayoutEffect } from "react";

import { Avatar, Card, Input, Button } from "@material-ui/core";

import { Imessage } from "../context/messagesContext";

interface Props {
  messages: Imessage[];
  disabled: boolean;
  handleMessage: (
    event: React.FormEvent<HTMLFormElement>,
    text: string
  ) => void;
  currentUserId: string;
}

const ChatBox: React.FC<Props> = ({
  messages,
  disabled,
  handleMessage,
  currentUserId
}) => {
  const [text, setText] = useState<string>("");
  let chatEl = useRef<HTMLDivElement | null>(null);

  function scrollToBottom() {
    if (chatEl.current) {
      const scrollHeight = chatEl.current.scrollHeight;
      const height = chatEl.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatEl.current.scrollTop = maxScrollTop > 0 ? maxScrollTop + 500 : 0;
    }
  }

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <Card style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <div
            className="flex flex-column col sm-p-0"
            style={{
              maxHeight: "30vh",
              minHeight: "25vh",
              padding: "6px",
              width: "100%"
            }}
          >
            <main className="chat flex flex-column flex-1 clear" ref={chatEl}>
              {messages.map(message => (
                <div
                  key={message.message + message.id}
                  className="message flex flex-row"
                >
                  {message.user && message.user.avatar && (
                    <Avatar src={message.user.avatar} />
                  )}

                  <div className="message-wrapper">
                    <p className="message-header">
                      <span className="username font-600">
                        {message.user && message.user.email}
                      </span>
                      <br />
                      <span className="sent-date font-300">
                        {/* {new Date(message.date).toDateString()} */}
                        {new Intl.DateTimeFormat("en-us", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,

                          timeZone: "America/New_York"
                          // timeZone: "America/Los_Angeles",
                        }).format(new Date(message.date))}
                        {/* {moment(message.createdAt).format("MMM Do, hh:mm:ss")} */}
                      </span>
                    </p>
                    <p className="message-content font-300">
                      {message.user && message.user.id === currentUserId ? (
                        <span className="messageFromMe">{message.message}</span>
                      ) : (
                        <span className="messageFromServer">
                          {message.message}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>

        <div className="formButtonContainer">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleMessage(e, text);
              setText("");
            }}
            // className="flex flex-row flex-space-between sm-px-0"
            id="send-message"
          >
            {" "}
            <Input
              type="text"
              name="text"
              // className="flex flex-3"
              style={{ padding: "1rem" }}
              autoCorrect="false"
              fullWidth
              placeholder="Type Here..."
              required
              inputMode="text"
              color="primary"
              autoComplete="false"
              value={text}
              autoFocus
              onChange={e => setText(e.target.value)}
            />
            <Button
              className="button-primary flex-1"
              type="submit"
              disabled={disabled}
              fullWidth
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </>
  );
};

export default ChatBox;
