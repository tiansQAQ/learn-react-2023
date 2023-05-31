# 使用 refs 操作 DOM 的最佳实践

Refs 是一个应急方案。你应该只在你必须“跳出 React”时使用它们。这方面的常见示例包括管理焦点、滚动位置或调用 React 未暴露的浏览器 API。

如果你坚持聚焦和滚动等非破坏性操作，应该不会遇到任何问题。但是，如果你尝试手动修改 DOM，则可能会与 React 所做的更改发生冲突。

为了说明这个问题，这个例子包括一条欢迎消息和两个按钮。第一个按钮使用 条件渲染 和 state 切换它的显示和隐藏，就像你通常在 React 中所做的那样。第二个按钮使用 remove() DOM API 将其从 React 控制之外的 DOM 中强行移除.

尝试按几次“通过 setState 切换”。该消息会消失并再次出现。然后按 “从 DOM 中删除”。这将强行删除它。最后，按 “通过 setState 切换”：

```js
import React, { useState, useRef } from 'react'

export default function Counter() {
  const [show, setShow] = useState(true)
  const ref = useRef(null)
  return (
    <div>
      <button
        onClick={() => {
          setShow(!show)
        }}
      >
        通过 setState 切换
      </button>
      <button
        onClick={() => {
          ref.current.remove()
        }}
      >
        从 DOM 中删除
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  )
}
```

在你手动删除 DOM 元素后，尝试使用 setState 再次显示它会导致崩溃。这是因为你更改了 DOM，而 React 不知道如何继续正确管理它。

避免更改由 React 管理的 DOM 节点。 对 React 管理的元素进行修改、添加子元素、从中删除子元素会导致不一致的视觉结果，或与上述类似的崩溃。

但是，这并不意味着你完全不能这样做。它需要谨慎。 你可以安全地修改 React 没有理由 更新的部分 DOM。 例如，如果某些 <div> 在 JSX 中始终为空，React 将没有理由去变动其子列表。 因此，在那里手动增删元素是安全的。

# 摘要

- Refs 是一个通用概念，但大多数情况下你会使用它们来保存 DOM 元素。
- 你通过传递`<div ref={myRef}>`指示 React 将 DOM 节点放入 myRef.current。
- 通常，你会将 refs 用于非破坏性操作，例如聚焦、滚动或测量 DOM 元素。
- 默认情况下，组件不暴露其 DOM 节点。 您可以通过使用 forwardRef 并将第二个 ref 参数传递给特定节点来暴露 DOM 节点。
- 避免更改由 React 管理的 DOM 节点。
- 如果你确实修改了 React 管理的 DOM 节点，请修改 React 没有理由更新的部分。
