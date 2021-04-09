// eslint-disable-next-line no-use-before-define
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  ListItem,
  Chip,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  innerMessage: {
    padding: '10px',
    whiteSpace: 'break-spaces',
  },
  message: {
    height: 'auto',
    whiteSpace: 'break-spaces',
    wordBreak: 'break-word',
  },
  botMessage: {
    borderTopLeftRadius: 0,
    float: 'left',
  },
  userMessage: {
    borderTopRightRadius: 0,
    float: 'right',
  },
  chatListItem: {
    display: 'inline-block',
  },
}));

function ChatBotMessages({ messagesList }: any) {
  const css = useStyles();

  return (
    messagesList.map(({ id, message, isBot }: any) => (
      <ListItem className={css.chatListItem} key={id}>
        <Chip
          label={(
            <Typography variant="body2" className={css.innerMessage}>
              {message}
            </Typography>
          )}
          color={isBot ? 'secondary' : 'primary'}
          className={`${css.message} ${
            isBot ? css.botMessage : css.userMessage
          }`}
        />
      </ListItem>
    ))
  );
}

export default React.memo(ChatBotMessages);
