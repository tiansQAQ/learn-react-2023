import React, { useRef, forwardRef } from 'react'

// 访问另一个组件的 DOM 节点

// 当你将 ref 放在像 <input /> 这样输出浏览器元素的内置组件上时，React 会将该 ref 的 current 属性设置为相应的 DOM 节点（例如浏览器中实际的 <input /> ）。

// 但是，如果你尝试将 ref 放在 你自己的 组件上，例如 <MyInput />，默认情况下你会得到 null。

// 发生这种情况是因为默认情况下，React 不允许组件访问其他组件的 DOM 节点。甚至自己的子组件也不行！这是故意的。Refs 是一个应急方案，应该谨慎使用。手动操作 另一个 组件的 DOM 节点会使你的代码更加脆弱。

// 相反，想要 暴露其 DOM 节点的组件必须选择该行为。一个组件可以指定将它的 ref “转发”给一个子组件。下面是 MyInput 如何使用 forwardRef API：

// 它是这样工作的:

// 1. <MyInput ref={inputRef} /> 告诉 React 将对应的 DOM 节点放入 inputRef.current 中。但是，这取决于 MyInput 组件是否允许这种行为， 默认情况下是不允许的。
// 2. MyInput 组件是使用 forwardRef 声明的。 这让从上面接收的 inputRef 作为第二个参数 ref 传入组件，第一个参数是 props 。
// 3. MyInput 组件将自己接收到的 ref 传递给它内部的 <input>。

// 现在，单击按钮聚焦输入框起作用了：

// 在设计系统中，将低级组件（如按钮、输入框等）的 ref 转发到它们的 DOM 节点是一种常见模式。
// 另一方面，像表单、列表或页面段落这样的高级组件通常不会暴露它们的 DOM 节点，以避免对 DOM 结构的意外依赖。
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
  return <input type="text" {...props} ref={ref} />
})
