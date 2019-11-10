import React, { useState, useRef, useLayoutEffect } from "react"

import { Avatar, Card, Input } from "@material-ui/core"
import "./chat.css"
import "./base.css"
import { Imessage } from "../../pages/Chat"
interface Props {
  messages: Imessage[]
  disabled: boolean
  sendMessage: (event: React.FormEvent<HTMLFormElement>, text: string) => void
}

const ChatBox: React.FC<Props> = ({ messages, sendMessage, disabled }) => {
  const [text, setText] = useState<string>("")
  let chatEl = useRef<HTMLDivElement | null>(null)

  function scrollToBottom() {
    if (chatEl.current) {
      const scrollHeight = chatEl.current.scrollHeight
      const height = chatEl.current.clientHeight
      const maxScrollTop = scrollHeight - height
      chatEl.current.scrollTop = maxScrollTop > 0 ? maxScrollTop + 500 : 0
    }
  }

  useLayoutEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <Card>
        <div style={{ position: "relative" }}>
          <div
            className="flex flex-column col sm-p-0"
            style={{
              maxHeight: "30vh",
              minHeight: "25vh",
              padding: "6px",
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
                      <span className="sent-date font-300">
                        {message.date.toString()}
                        {/* {moment(message.createdAt).format("MMM Do, hh:mm:ss")} */}
                      </span>
                    </p>
                    <p className="message-content font-300">
                      {message.message}
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
              sendMessage(e, text)
              setText("")
            }}
            className="flex flex-row flex-space-between sm-px-0"
            id="send-message"
          >
            {" "}
            <Input
              type="text"
              name="text"
              className="flex flex-3"
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
            <button
              className="button-primary flex-1"
              type="submit"
              disabled={disabled}
            >
              Send
            </button>
          </form>
        </div>
      </Card>
    </>
  )
}

export default ChatBox
