// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  TextField,
  List,
  Paper,
  Button,
} from '@material-ui/core';
import { SocketClient } from '@cognigy/socket-client';
// @ts-ignore
import useLocalStorage from '../customHook/useLocalStorage.tsx';
// @ts-ignore
import ChatMessages from './ChatMessages.tsx';

const useStyles = makeStyles(() => ({
  chat: {
    backgroundColor: 'azure',
    height: '600px',
    margin: '10px',
    width: '300px',
  },
  chatList: {
    height: '100%',
    overflowY: 'auto',
    padding: 0,
  },
  input: {
    background: 'white',
    marginTop: '20px',
  },
}));

const ENDPOINT_URL = 'https://endpoint-demo.cognigy.ai';
const URL_TOKEN = 'ce5c41bdbd3cc71fbb81b0f192e46c9b1f306988cc03d9bc5a348ad96d249aba';

const client = new SocketClient(ENDPOINT_URL, URL_TOKEN, {
  // if you use node, internet explorer or safari, you need to enforce websockets
  forceWebsockets: true,
});

function ChatBot() {
  const css = useStyles();

  const enterKeyCode = 13;
  const [userMessage, setUserMessage] = useLocalStorage('userMessage', '');
  const [messagesList, setMessagesList] = useLocalStorage('chatList', []);

  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = (e:{keyCode: number}) => {
    if (e.keyCode === enterKeyCode && userMessage.length !== 0) {
      setUserMessage('');
      setMessagesList((prevState: any) => [
        ...prevState,
        { id: prevState[prevState.length - 1]?.id + 1 || 0, message: userMessage, isBot: false },
      ]);
      client.sendMessage(userMessage);
    }
  };

  const resetChat = () => {
    setUserMessage('');
    setMessagesList([]);
  };

  useEffect(() => {
    client.connect();
    client.on('output', (output) => {
      // eslint-disable-next-line no-console
      console.log(output);
      if (output.data !== null) {
        setMessagesList((prevState: any) => [
          ...prevState,
          { id: prevState[prevState.length - 1].id + 1, message: output.text, isBot: true },
        ]);
      }
    });
    return () => {
      // eslint-disable-next-line no-console
      console.log('disconnect');
      client.disconnect();
    };
  }, [setMessagesList]);

  useEffect(() => {
    chatRef?.current?.scrollIntoView({ block: 'end' });
  }, [messagesList]);

  return (
    <>
      <Paper elevation={3} className={css.chat}>
        <List className={css.chatList}>
          <div ref={chatRef}>
            <ChatMessages messagesList={messagesList} />
          </div>
        </List>
        <TextField
          className={css.input}
          autoFocus
          id="outlined-basic"
          label="Please write your message"
          variant="outlined"
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={sendMessage}
          value={userMessage}
        />
        <Button variant="contained" onClick={() => resetChat()}>Reset Chat</Button>
      </Paper>
    </>
  );
}

export default ChatBot;
