import React, { useState } from 'react'
// 方法一：将组件渲染在不同的位置,你如果想让两个 Counter 各自独立的话，可以将它们渲染在不同的位置：
// 起初 isPlayerA 的值是 true。所以第一个位置包含了 Counter 的 state，而第二个位置是空的。
// 当你点击“下一位玩家”按钮时，第一个位置会被清空，而第二个位置现在包含了一个 Counter。
// 每次一个 Counter 被从 DOM 中移除时，它的 state 就会被销毁。这就是每次你点击按钮时它们就会被重置的原因。
// 这个解决方案在你只有少数几个独立的组件渲染在相同的位置时会很方便。这个例子中只有 2 个组件，所以在 JSX 里将它们分开进行渲染并不麻烦。
export default function Counter9() {
  const [isPlayerA, setIsPlayerA] = useState(true)
  return (
    <div>
      {isPlayerA && <Counter person="Taylor" />}
      {!isPlayerA && <Counter person="Sarah" />}
      <button
        onClick={() => {
          setIsPlayerA(!isPlayerA)
        }}
      >
        下一位玩家！
      </button>
    </div>
  )
}

function Counter({ person }) {
  const [score, setScore] = useState(0)
  const [hover, setHover] = useState(false)

  let className = 'counter'
  if (hover) {
    className += ' hover'
  }

  return (
    <div className={className} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <h1>
        {person} 的分数：{score}
      </h1>
      <button onClick={() => setScore(score + 1)}>加一</button>
    </div>
  )
}
