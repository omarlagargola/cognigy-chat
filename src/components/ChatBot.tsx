import React, { useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  TextField,
  List,
  ListItem,
  Chip,
  Typography,
  Paper,
  Button,
} from "@material-ui/core";
import { SocketClient } from "@cognigy/socket-client";
import useLocalStorage from "../customHook/useLocalStorage";

const useStyles = makeStyles((theme) => ({
  chat: {
    backgroundColor: "azure",
    height: "600px",
    margin: "10px",
    width: "300px",
  },
  chatList: {
    height: "100%",
    overflowY: "auto",
    padding: 0,
  },
  innerMessage: {
    padding: "10px",
    whiteSpace: "break-spaces",
  },
  message: {
    height: "auto",
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
  },
  botMessage: {
    borderTopLeftRadius: 0,
    float: "left",
  },
  userMessage: {
    borderTopRightRadius: 0,
    float: "right",
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
  const [userMessage, setUserMessage] = useLocalStorage("userMessage", "");
  const [messagesList, setMessagesList] = useLocalStorage("chatList", []);

  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = (e:{keyCode: number}) => {
    if (e.keyCode === enterKeyCode && userMessage.length !== 0) {
      setUserMessage("");
      setMessagesList((prevState: any) => [
        ...prevState,
        { id: prevState[prevState.length-1]?.id+1 || 0, message: userMessage, isBot: false },
      ]);
      client.sendMessage(userMessage);
    }
  };

  const resetChat = () => {
    setUserMessage("");
    setMessagesList([]);
  };

  useEffect(() => {
    client.connect();
    client.on("output", (output) => {
      console.log(output);
      if(output.data !== null){
        setMessagesList((prevState: any) => [
          ...prevState,
          { id: prevState[prevState.length-1].id+1 , message: output.text, isBot: true },
        ]);
      }
    });
    return () => {
      console.log("disconnect");
      client.disconnect();
    }
  }, [setMessagesList]);

  useEffect(() => {
    chatRef?.current?.scrollIntoView({block: "end"});
  }, [messagesList]);

  return(
    <>
      <Paper elevation={3} className={css.chat}>
        <List className={css.chatList}>
          <div ref={chatRef}>
            {messagesList.map(({ id, message, isBot }: any) => (
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
          onChange={e => setUserMessage(e.target.value)}
          onKeyDown={sendMessage}
          value={userMessage}
        />
        <Button variant="contained" onClick={()=>resetChat()}>Reset Chat</Button>
      </Paper>
    </>
  );
}

export default ChatBot;