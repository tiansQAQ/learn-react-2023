import React, { useState } from 'react'
// 每次你点击按钮，输入框的 state 都会消失！这是因为每次 MyComponent 渲染时都会创建一个 不同 的 MyTextField 函数。
// 你在相同位置渲染的是 不同 的组件，所以 React 将其下所有的 state 都重置了。
// 这样会导致 bug 以及性能问题。为了避免这个问题， 永远要将组件定义在最上层并且不要把它们的定义嵌套起来。
export default function Counter7() {
  const [counter, setCounter] = useState(0)
  function MyTextField() {
    const [text, setText] = useState('')

    return <input value={text} onChange={(e) => setText(e.target.value)} />
  }
  return (
    <>
      <MyTextField />
      <button
        onClick={() => {
          setCounter(counter + 1)
        }}
      >
        点击了 {counter} 次
      </button>
    </>
  )
}
