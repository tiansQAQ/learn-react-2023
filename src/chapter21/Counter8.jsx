import React, { useState } from 'react'
// 默认情况下，React 会在一个组件保持在同一位置时保留它的 state。
// 通常这就是你想要的，所以把它作为默认特性很合理。但有时候，你可能想要重置一个组件的 state。
// 考虑一下这个应用，它可以让两个玩家在每个回合中记录他们的得分：

// 目前当你切换玩家时，分数会被保留下来。这两个 Counter 出现在相同的位置，所以 React 会认为它们是 同一个 Counter，只是传了不同的 person prop。

// 但是从概念上讲，这个应用中的两个计数器应该是各自独立的。虽然它们在 UI 中的位置相同，但是一个是 Taylor 的计数器，一个是 Sarah 的计数器。

// 有两个方法可以在它们相互切换时重置 state：
// 1. 将组件渲染在不同的位置
// 2. 使用 key 赋予每个组件一个明确的身份
export default function Counter8() {
  const [isPlayerA, setIsPlayerA] = useState(true)
  return (
    <div>
      {isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}
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
