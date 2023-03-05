import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/index.css"
import axios from "axios";

axios.defaults.baseURL = `${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_BACKEND_PORT}`;
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
