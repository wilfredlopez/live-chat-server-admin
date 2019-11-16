import { createContext } from "react";
import { Maybe, User } from "../generated/apolloComponents";

export interface IMesasgesContext {
  sendMessage: (
    event: React.FormEvent<HTMLFormElement>,
    text: string,
    channelId: string,
    userId: string
  ) => void;
  setMessages: React.Dispatch<React.SetStateAction<Imessage[]>>;
  messages: Imessage[];
  isLoading: boolean;
}

export interface Imessage {
  id: string;
  message: string;
  date: Date;

  user?: Maybe<Pick<User, "name" | "id" | "avatar" | "email">>;
}

const initialContext: IMesasgesContext = {
  sendMessage: () => {},
  setMessages: () => {},
  messages: [],
  isLoading: true
};

const MessagesContext = createContext(initialContext);

export default MessagesContext;
