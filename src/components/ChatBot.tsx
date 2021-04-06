import React, { useState, useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  TextField,
  List,
  ListItem,
  Chip,
  Typography,
  Paper,
} from "@material-ui/core";
import { SocketClient } from "@cognigy/socket-client";

const useStyles = makeStyles((theme) => ({
  chat: {
    height: "600px",
    width: "300px",
    backgroundColor: "azure",
    margin: "10px",
  },
  chatList: {
    height: "100%",
    overflowY: "auto",
    padding: 0,
  },
  innerMessage: {
    whiteSpace: "break-spaces",
    padding: "10px",
  },
  message: {
    height: "auto",
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
  },
  botMessage: {
    float: "left",
    borderTopLeftRadius: 0,
  },
  userMessage: {
    float: "right",
    borderTopRightRadius: 0,
  },
  chatListItem: {
    display: "inline-block",
  },
  input: {
    background: "white",
    marginTop: "20px",
  },
}));

const ENDPOINT_URL = "https://endpoint-demo.cognigy.ai";
const URL_TOKEN = "ce5c41bdbd3cc71fbb81b0f192e46c9b1f306988cc03d9bc5a348ad96d249aba";

let client = new SocketClient(ENDPOINT_URL, URL_TOKEN, {
  // if you use node, internet explorer or safari, you need to enforce websockets
  forceWebsockets: true,
});

function ChatBot() {
  const css = useStyles();

  const enterKeyCode = 13;
  const [userMessage, setUserMessage] = useState("");
  const [messagesList, setMessagesList] = useState([{id:0, message:"I am chatbot", isBot:true}]);

  const chatRef = useRef<HTMLDivElement>(null);

  const handleMessage = (e:{target:{value: React.SetStateAction<string>}}) => {
    setUserMessage(e.target.value);
  };

  const handleMessageSent = async (e:{keyCode: number}) => {
    if (e.keyCode === enterKeyCode && userMessage.length !== 0) {
      setUserMessage("");
      setMessagesList((prevState) => [
        ...prevState,
        { id: prevState[prevState.length-1].id+1, message: userMessage, isBot: false },
      ]);
      client.sendMessage(userMessage);
    }
  };

  useEffect(() => {
    client.connect();
    client.on("output", (output) => {
      console.log(output);
      if(output.data !== null){
        setMessagesList((prevState) => [
          ...prevState,
          { id: prevState[prevState.length-1].id+1 , message: output.text, isBot: true },
        ]);
      }
    });
    return () => {
      console.log("disconnect");
      client.disconnect();
    }
  }, []);

  useEffect(() => {
    chatRef?.current?.scrollIntoView({ behavior: "smooth", block: "end"});
  }, [messagesList]);

  return(
    <>
      <Paper elevation={3} className={css.chat}>
        <List className={css.chatList}>
          <div ref={chatRef}>
            {messagesList.map(({ id, message, isBot }) => (
              <ListItem className={css.chatListItem} key={id}>
                <Chip
                  label={
                    <Typography variant="body2" className={css.innerMessage}>
                      {message}
                    </Typography>
                  }
                  color={isBot ? "secondary" : "primary"}
                  className={`${css.message} ${
                    isBot ? css.botMessage : css.userMessage
                  }`}
                />
              </ListItem>
            ))}
          </div>
        </List>
        <TextField
          className={css.input}
          autoFocus={true}
          id="outlined-basic"
          label="Please write your message"
          variant="outlined"
          onChange={handleMessage}
          onKeyDown={handleMessageSent}
          value={userMessage}
        />
      </Paper>
    </>
  );
}

export default ChatBot;