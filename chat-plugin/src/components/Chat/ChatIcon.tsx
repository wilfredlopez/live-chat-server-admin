import React from "react";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import { Button } from "@material-ui/core";

interface Props {
  handleClick: () => void;
  open: boolean;
}

const ChatIcon: React.FC<Props> = ({ handleClick, open }) => {
  return (
    <Button onClick={handleClick}>
      <div className="chat_container_div">
        <div className="bubble_container">
          {/* <div className="chat_button"> */}
          <ChatBubbleIcon
            titleAccess="Chat"
            fontSize="large"
            color="primary"
            scale={7}
          />
          {/* {open ? (
              <svg
                focusable="false"
                aria-hidden="true"
                width="14"
                height="14"
                className="chat_icon_svg "
              >
                <path
                  d="M13.978 12.637l-1.341 1.341L6.989 8.33l-5.648 5.648L0 12.637l5.648-5.648L0 1.341 1.341 0l5.648 5.648L12.637 0l1.341 1.341L8.33 6.989l5.648 5.648z"
                  fillRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                width="28px"
                height="28px"
                viewBox="0 0 28 28"
                className="chat_icon_svg "
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g fill="#000000">
                    <path d="M14,25.5 C12.4,25.5 10.8,25.2 9.4,24.7 L4.5,27.5 L4.5,21.9 C2,19.6 0.5,16.5 0.5,13 C0.5,6.1 6.5,0.5 14,0.5 C21.5,0.5 27.5,6.1 27.5,13 C27.5,19.9 21.5,25.5 14,25.5 L14,25.5 Z M9,11.5 C8.2,11.5 7.5,12.2 7.5,13 C7.5,13.8 8.2,14.5 9,14.5 C9.8,14.5 10.5,13.8 10.5,13 C10.5,12.2 9.8,11.5 9,11.5 L9,11.5 Z M14,11.5 C13.2,11.5 12.5,12.2 12.5,13 C12.5,13.8 13.2,14.5 14,14.5 C14.8,14.5 15.5,13.8 15.5,13 C15.5,12.2 14.8,11.5 14,11.5 L14,11.5 Z M19,11.5 C18.2,11.5 17.5,12.2 17.5,13 C17.5,13.8 18.2,14.5 19,14.5 C19.8,14.5 20.5,13.8 20.5,13 C20.5,12.2 19.8,11.5 19,11.5 L19,11.5 Z"></path>
                  </g>
                </g>
              </svg>
            )} */}
        </div>
      </div>
      {/* </div> */}
    </Button>
  );
};
export default ChatIcon;
