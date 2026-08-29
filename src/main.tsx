import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAntiTheftProtection } from './utils/security.ts';

// Initialize anti-copy and anti-inspection protection
initAntiTheftProtection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

