import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { recordVisit } from './hooks/useAnalytics'
import './index.css'

// 开发环境品牌标识（生产构建由 terser drop_console 移除）
if (import.meta.env.DEV) {
  console.log(
    '%c Quiddity %c dev ',
    'color: #fff; background: #14b0ff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'color: #14b0ff; background: #1a1a2e; padding: 4px 8px; border-radius: 0 4px 4px 0;',
  );
  console.log(
    '%c© 2026 Quiddity. All rights reserved.\n本网站代码著作权归Quiddity开发者所有。',
    'color: #a78bfa; font-weight: bold;',
  );
}

// 记录一次访问（轻量本地统计，不上报第三方）
recordVisit();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)