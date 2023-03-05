import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/index.css"
import axios from "axios";

axios.defaults.baseURL = `https://t3a2-b-production.up.railway.app`;
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
