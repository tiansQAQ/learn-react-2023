import React, { useRef } from 'react'

// 使文本输入框获得焦点

// 在本例中，单击按钮将使输入框获得焦点：

// 虽然 DOM 操作是 ref 最常见的用例，但 useRef Hook 可用于存储 React 之外的其他内容，例如计时器 ID 。
// 与 state 类似，ref 能在渲染之间保留。你甚至可以将 ref 视为设置它们时不会触发重新渲染的 state 变量！
export default function FormRef() {
  // 1. 使用 useRef Hook 声明 inputRef
  const inputRef = useRef(null)

  // 3. 在 handleClick 函数中，从 inputRef.current 读取 input DOM 节点并使用 inputRef.current.focus() 调用它的 focus()。
  function handleClick() {
    inputRef.current.focus()
  }

  return (
    <div>
      {/* 2. 像 <input ref={inputRef}> 这样传递它。这告诉 React 将这个 <input> 的 DOM 节点放入 inputRef.current。 */}
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>聚焦</button>
    </div>
  )
}
