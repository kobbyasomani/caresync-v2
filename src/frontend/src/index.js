import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/index.css"
import axios from "axios";

axios.defaults.baseURL = `http://localhost:${process.env.REACT_APP_BACKEND_PORT}`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
