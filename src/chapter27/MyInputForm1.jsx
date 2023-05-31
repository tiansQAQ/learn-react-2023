import React, { useRef, forwardRef, useImperativeHandle } from 'react'

// 使用命令句柄暴露一部分 API

// 在上面的例子中，MyInput 暴露了原始的 DOM 元素 input。这让父组件可以对其调用focus()。
// 然而，这也让父组件能够做其他事情 —— 例如，改变其 CSS 样式。
// 在一些不常见的情况下，你可能希望限制暴露的功能。你可以用 useImperativeHandle 做到这一点：

// 这里，MyInput 中的 realInputRef 保存了实际的 input DOM 节点。
// 但是，useImperativeHandle 指示 React 将你自己指定的对象作为父组件的 ref 值。
// 所以 Form 组件内的 inputRef.current 将只有 focus 方法。
// 在这种情况下，ref “句柄”不是 DOM 节点，而是你在 useImperativeHandle 调用中创建的自定义对象。
export default function MyInputForm() {
  const inputRef = useRef(null)

  function handleClick() {
    inputRef.current.focus()
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  )
}

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    // 只暴露 focus，没有别的
    focus() {
      realInputRef.current.focus()
    }
  }))
  return <input type="text" {...props} ref={realInputRef} />
})
