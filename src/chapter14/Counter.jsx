import React, { useState } from 'react'
// 排队一系列状态更改
export default function Counter() {
  const [score, setScore] = useState(0)

  // 设置状态会请求一个新的重新渲染，但不会在已运行的代码中更改它。所以在你调用 setScore(score + 1) 后，score 仍然是 0。

  //   function increment() {
  //     setScore(score + 1)
  //   }

  // 可以通过在设置状态时传递一个 更新器函数 来解决这个问题。要排队进行多次状态更新
  function increment() {
    setScore((s) => s + 1)
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
      <h1>Score: {score}</h1>
    </>
  )
}
