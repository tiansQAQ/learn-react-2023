import React, { useState } from 'react'
import Counter1 from './Counter1.jsx'
// 只有当你在相同的位置渲染相同的组件时，React 才会一直保留着组件的 state。想要验证这一点，可以将两个计数器的值递增，取消勾选 “渲染第二个计数器” 复选框，然后再次勾选它.
// 注意，当你停止渲染第二个计数器的那一刻，它的 state 完全消失了。这是因为 React 在移除一个组件时，也会销毁它的 state。
// 当你重新勾选“渲染第二个计数器”复选框时，另一个计数器及其 state 将从头开始初始化（score = 0）并被添加到 DOM 中。
// 只要一个组件还被渲染在 UI 树的相同位置，React 就会保留它的 state。 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。
export default function Counter2() {
  const [showB, setShowB] = useState(false)

  return (
    <div>
      <Counter1 />
      {showB && <Counter1 />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={(e) => {
            setShowB(e.target.checked)
          }}
        />
        渲染第二个计数器
      </label>
    </div>
  )
}
