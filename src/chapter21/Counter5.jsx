import React, { useState } from 'react'
import Counter1 from './Counter1.jsx'

// 相同位置的不同组件会使 state 重置
// 在这个例子中，勾选复选框会将 <Counter> 替换为一个 <p>：
// 示例中，你在相同位置对 不同 的组件类型进行切换。刚开始 <div> 的第一个子组件是一个 Counter。但是当你切换成 p 时，React 将 Counter 从 UI 树中移除了并销毁了它的状态。
export default function Counter5() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div>
      {isPaused ? <p>待会见</p> : <Counter1 />}

      <label>
        <input type="checkbox" checked={isPaused} onChange={(e) => setIsPaused(e.target.checked)} />
        休息一下
      </label>
    </div>
  )
}
