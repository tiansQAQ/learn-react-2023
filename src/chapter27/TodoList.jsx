import React, { useState, useRef } from 'react'
import { flushSync } from 'react-dom'

// React 何时添加 refs

// 在 React 中，每次更新都分为 两个阶段：

// 1. 在 渲染 阶段， React 调用你的组件来确定屏幕上应该显示什么。
// 2. 在 提交 阶段， React 把变更应用于 DOM。

// 通常，你 不希望 在渲染期间访问 refs。这也适用于保存 DOM 节点的 refs。在第一次渲染期间，DOM 节点尚未创建，因此 ref.current 将为 null。在渲染更新的过程中，DOM 节点还没有更新。所以读取它们还为时过早。

// React 在提交阶段设置 ref.current。在更新 DOM 之前，React 将受影响的 ref.current 值设置为 null。更新 DOM 后，React 立即将它们设置到相应的 DOM 节点。

// 通常，你将从事件处理器访问 refs。 如果你想使用 ref 执行某些操作，但没有特定的事件可以执行此操作，你可能需要一个 effect。我们将在下一页讨论 effect。

// 用 flushSync 同步更新 state

// 思考这样的代码，它添加一个新的待办事项，并将屏幕向下滚动到列表的最后一个子项。请注意，出于某种原因，它总是滚动到最后一个添加之前 的待办事项：

// 在 React 中，state 更新是排队进行的。通常，这就是你想要的。
// 但是，在这个示例中会导致问题，因为 setTodos 不会立即更新 DOM。
// 因此，当你将列表滚动到最后一个元素时，尚未添加待办事项。这就是为什么滚动总是“落后”一项的原因。

// 要解决此问题，你可以强制 React 同步更新（“刷新”）DOM。 为此，从 react-dom 导入 flushSync 并将 state 更新包裹 到 flushSync 调用中：

// 这将指示 React 当封装在 flushSync 中的代码执行后，立即同步更新 DOM。因此，当你尝试滚动到最后一个待办事项时，它已经在 DOM 中了：
export default function TodoList() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState(initialTodos)
  const listRef = useRef(null)
  function handleAdd() {
    const newTodo = { id: nextId++, text: text }

    // 问题出在这两行：
    // setTodos([...todos, newTodo])
    // listRef.current.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    flushSync(() => {
      setText('')
      setTodos([...todos, newTodo])
    })
    listRef.current.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <>
      <div>
        <button onClick={handleAdd}>添加</button>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <ul ref={listRef}>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}

let nextId = 0
let initialTodos = []
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: '待办 #' + (i + 1)
  })
}
