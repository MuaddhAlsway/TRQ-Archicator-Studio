import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // Initialize i18n before app renders
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
