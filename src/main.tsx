import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handling to prevent white screen crashes
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global Error:', error);
  // If we see a chunk loading error (common after a new build), force a clean reload
  if (message.toString().includes('Loading chunk') || message.toString().includes('CSS_CHUNK_LOAD_FAILED')) {
    window.location.reload();
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
