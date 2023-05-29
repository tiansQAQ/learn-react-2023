import React, { useState } from 'react'
import Counter1 from './Counter1.jsx'

// 当你勾选或清空复选框的时候，计数器 state 并没有被重置。不管 isFancy 是 true 还是 false，根组件 App 返回的 div 的第一个子组件都是 <Counter />：
// 更新 App 的状态不会重置 Counter，因为 Counter 始终保持在同一位置。
// 它是位于相同位置的相同组件，所以对 React 来说，它是同一个计数器。

export default function Counter3() {
  const [isFancy, setIsFancy] = useState(0)
  return (
    <div>
      {isFancy ? <Counter1 isFancy={isFancy} /> : <Counter1 isFancy={isFancy} />}

      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  )
}
