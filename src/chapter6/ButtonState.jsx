import React, { useState } from 'react'

// 使用useState添加状态,以use开头的函数称为Hooks。useState是React提供的内置Hook。只能在组件（或其他 Hook）的顶部调用 Hook。
// 每个 ButtonState 都有自己独立的 count ，单击每个按钮时，仅更改了单击按钮的 count
export default function ButtonState() {
  // 声明一个状态变量,约定编写 [something, setSomething]
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return <button onClick={handleClick}> Clicked {count} times</button>
}
