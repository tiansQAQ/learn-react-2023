import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

//<React.StrictMode> 在严格模式下开发时，它将会调用每个组件函数两次。通过重复调用组件函数，严格模式有助于检测不纯的计算的组件。
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
