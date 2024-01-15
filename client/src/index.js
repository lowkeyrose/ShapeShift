import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutContextProvider } from './context/WorkoutContext';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextProvider } from './context/GlobalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContextProvider>
        <WorkoutContextProvider>
            <App />
        </WorkoutContextProvider>
      </GlobalContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)