import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './Router.jsx'

console.log('main.jsx loaded');
const rootElement = document.getElementById('root');
console.log('root element:', rootElement);

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppRouter />
    </StrictMode>,
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = '<div style="color: red; padding: 20px;"><h1>Error Loading App</h1><p>' + error.message + '</p><pre>' + error.stack + '</pre></div>';
}