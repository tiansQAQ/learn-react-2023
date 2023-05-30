import React from 'react'
import pageClasses from './page.module.css'
import { LevelContext } from './LevelContext'

// 把它们用 context provider 包裹起来  以提供 LevelContext 给它们：

// 这告诉 React：“如果在 <Section> 组件中的任何子组件请求 LevelContext，给他们这个 level。”组件会使用 UI 树中在它上层最近的那个 <LevelContext.Provider> 传递过来的值。
export default function Section({ level, children }) {
  return (
    <section className={pageClasses.section}>
      <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
    </section>
  )
}
