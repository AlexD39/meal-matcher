import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './App'
import { IngredientProvider } from './context/IngredientContext'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el elemento root')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <IngredientProvider>
        <App />
      </IngredientProvider>
    </BrowserRouter>
  </StrictMode>,
)