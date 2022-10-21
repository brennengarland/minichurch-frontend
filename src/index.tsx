import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import * as ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
const PROD_URL = 'https://minichurch-backend.onrender.com/graphql'

const client = new ApolloClient({
  uri: PROD_URL,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={1} 
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}>
        <App />
      </SnackbarProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
