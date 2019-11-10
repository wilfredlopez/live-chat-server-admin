import React from "react"
import { Link } from "react-router-dom"

interface Props {}

const Dashboard: React.FC<Props> = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/chat">Take Chats</Link>
    </div>
  )
}

export default Dashboard
