import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserProvider from "./UserContext"
import { BrowserRouter as Router } from "react-router-dom"
import {ThemeProvider} from '@material-ui/core/styles'
import theme from './theme'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
