import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../css/style.css'; // Original glassmorphism styles
import './index.css';     // Premium E-Commerce styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
