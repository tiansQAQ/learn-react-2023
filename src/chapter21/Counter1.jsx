import React, { useState } from 'react'
import CounterClass from './counter.module.css'
// 当你为一个组件添加 state 时，你可能会觉得 state “活”在组件内部。实际上，state 被保存在 React 内部。根据组件在 UI 树中的位置，React 将它所持有的每个 state 与正确的组件关联起来。
// 下面只定义了一个 <Counter1 /> JSX 标签，但将它渲染在了两个不同的位置。
// 在 React 中，屏幕中的每个组件都有完全独立的 state。举个例子，当你并排渲染两个 Counter1 组件时，它们都会拥有各自独立的 score 和 hover state。
export default function Counter1({ isFancy }) {
  const [score, setScore] = useState(0)
  const [hover, setHover] = useState(false)

  let className = CounterClass.counter

  if (hover) {
    className += ` ${CounterClass.hover}`
  }

  if (isFancy) {
    className += ` ${CounterClass.fancy}`
  }
  return (
    <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>加一</button>
    </div>
  )
}
