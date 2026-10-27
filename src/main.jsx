import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LangProvider } from './i18n/lang';
import App from './App';
import './styles/base.css';
import './styles/sections.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </StrictMode>
);
