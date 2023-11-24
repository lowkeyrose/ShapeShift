import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { WorkoutContextProvider } from './context/WorkoutContext';
import { ExerciseContextProvider } from './context/ExerciseContext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <WorkoutContextProvider>
        <ExerciseContextProvider>
          <App />
        </ExerciseContextProvider>
      </WorkoutContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)