import * as React from "react";
import { Button } from "@material-ui/core";
import MinimizeIcon from "@material-ui/icons/Minimize";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MessagesContext from "../context/messagesContext";

interface ICardHeaderProps {
  minimize: () => void;
  showLogout?: boolean;
  title: string;
}

const CardHeader: React.FunctionComponent<ICardHeaderProps> = ({
  minimize,
  showLogout,
  title
}) => {
  const { logout } = React.useContext(MessagesContext);

  return (
    <div
      className="flex m-auto"
      style={{
        padding: "0 6px",
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        border: "1px solid #f4f4f4"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          padding: "0",
          margin: "0.4em",
          fontSize: "1.8rem"
        }}
      >
        {title}
      </h1>
      <div>
        <Button
          onClick={() => minimize()}
          variant="outlined"
          size="small"
          title="Minimize"
          // style={{ height: "40px" }}
        >
          <MinimizeIcon />
        </Button>
        {showLogout && (
          <Button
            onClick={() => logout()}
            title="Close"
            size="small"
            // color="primary"
            variant="outlined"
            style={{ color: "red" }}
          >
            <ExitToAppIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardHeader;
