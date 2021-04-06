import React from 'react';
import ChatBot from './components/ChatBot';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  App:{
    textAlign: "center",
  },
  AppHeader: {
    backgroundColor: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
  },
  navLink: {
    flexGrow: 1,
  },
  link: {
    color: "white",
  },
}));
function App() {
  const css = useStyles();
  return (
    <div className={css.App}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={css.navLink}>
              <Link className={css.link} to="/chat">Chat</Link>
            </Typography>
            <Typography variant="h6" className={css.navLink}>
              <Link className={css.link} to="/nochat">No chat</Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <header className={css.AppHeader}>
          <Switch>
            <Redirect exact from="/" to="/chat" />
            <Route
              exact
              path="/chat"
              render={() => <ChatBot></ChatBot>}
            />
          </Switch>
        </header>
      </BrowserRouter>
    </div>
  );
}

export default App;
