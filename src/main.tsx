import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

console.log(
  '%c 九语 Jiuyu %c v1.0.0 ',
  'color: #fff; background: #7c3aed; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
  'color: #7c3aed; background: #1a1a2e; padding: 4px 8px; border-radius: 0 4px 4px 0;',
);
console.log(
  '%c© 2026 Jiuyu. All rights reserved.%c\n本网站代码著作权归九语开发者所有。',
  'color: #a78bfa; font-weight: bold;',
  'color: #888;',
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
