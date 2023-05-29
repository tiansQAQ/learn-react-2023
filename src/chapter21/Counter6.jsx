import React, { useState } from 'react'
import Counter1 from './Counter1.jsx'

// 当你在相同位置渲染不同的组件时，组件的整个子树都会被重置。要验证这一点，可以增加计数器的值然后勾选复选框：
// 当你勾选复选框后计数器的 state 被重置了。虽然你渲染了一个 Counter，但是 div 的第一个子组件从 div 变成了 section。当子组件 div 从 DOM 中被移除的时候，它底下的整棵树（包含 Counter 以及它的 state）也都被销毁了。
// 一般来说，如果你想在重新渲染时保留 state，几次渲染中的树形结构就应该相互“匹配”。结构不同就会导致 state 的销毁，因为 React 会在将一个组件从树中移除时销毁它的 state。
export default function Counter6() {
  const [isFancy, setIsFancy] = useState(false)
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter1 isFancy={isFancy} />
        </div>
      ) : (
        <section>
          <Counter1 isFancy={isFancy} />
        </section>
      )}

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
