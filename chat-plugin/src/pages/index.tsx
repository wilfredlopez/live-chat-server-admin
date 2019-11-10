import * as React from "react"
import Chat from "./Chat"
import ChatIcon from "../components/Chat/ChatIcon"
import { useGuestMeQueryQuery } from "../generated/apolloComponents"
import Login from "../components/login"

interface IAppProps {}

const Index: React.FunctionComponent<IAppProps> = props => {
  const [open, setOpen] = React.useState(false)
  const { data } = useGuestMeQueryQuery()

  const chatIconComponent = (
    <ChatIcon handleClick={() => setOpen(value => !value)} open={open} />
  )

  if (data && !data.guestMe) {
    return open ? <Login /> : chatIconComponent
  }

  if (open && data && data.guestMe) {
    return (
      <>
        <Chat userId={data.guestMe.id} channelId={data.guestMe.channelId} />{" "}
        {chatIconComponent}
      </>
    )
  } else {
    return chatIconComponent
  }
}

export default Index
