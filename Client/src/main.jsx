import React from 'react';
import { UserProvider } from '../src/components/project/UserContext';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
  <App />
</UserProvider>
);
