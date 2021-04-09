// eslint-disable-next-line no-use-before-define
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// @ts-ignore
import App from './App.tsx';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
