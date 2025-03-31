import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --neon-pink: #ff00ff;
    --neon-blue: #00ffff;
    --neon-purple: #9900ff;
    --dark-bg: #0a0a0a;
    --darker-bg: #050505;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Cyberpunk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: var(--darker-bg);
    color: #fff;
    line-height: 1.5;
    overflow-x: hidden;
  }

  @font-face {
    font-family: 'Cyberpunk';
    src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
  }
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
) 