import React, { useState, useReducer } from 'react'
import AddTask from './AddTask.jsx'
import TaskList from './TaskList.jsx'

let nextId = 3
const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
]

// 现在一切都准备就绪了！我们在这里把 reducer 定义在了组件的末尾
export default function TaskApp2() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  function handleAddTask(text) {
    dispatch(/*action 对象*/ { type: 'added', id: nextId++, text: text })
  }

  function handleChangeTask(task) {
    dispatch(/*action 对象*/ { type: 'changed', task: task })
  }

  function handleDeleteTask(taskId) {
    dispatch(/*action 对象*/ { type: 'deleted', id: taskId })
  }
  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
    </>
  )
}

// 如果有需要，你甚至可以把 reducer 移到一个单独的文件中：tasksReducer.js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added':
      return [...tasks, { id: action.id, text: action.text, done: false }]
    case 'changed':
      return tasks.map((t) => (t.id === action.task.id ? action.task : t))
    case 'deleted':
      return tasks.filter((task) => task.id !== action.id)
    default:
      throw Error('未知 action: ' + action.type)
  }
}

// 对比 useState 和 useReducer
// Reducers 并非没有缺点！以下是比较它们的几种方法：

// 代码体积： 通常，在使用 useState 时，一开始只需要编写少量代码。而 useReducer 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，useReducer 可以减少代码量。
// 可读性： 当状态更新逻辑足够简单时，useState 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，useReducer 允许你将状态更新逻辑与事件处理程序分离开来。
// 可调试性： 当使用 useState 出现问题时, 你很难发现具体原因以及为什么。 而使用 useReducer 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 action）。 如果所有 action 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 useState 相比，你必须单步执行更多的代码。
// 可测试性： reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 action，断言 reducer 返回的特定状态会很有帮助。
// 个人偏好： 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 useState 和 useReducer 之间切换，它们能做的事情是一样的！
// 如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 reducer。当然，你也不必整个项目都用 reducer，这是可以自由搭配的。你甚至可以在一个组件中同时使用 useState 和 useReducer。

// 编写一个好的 reducers
// 编写 reducers 时最好牢记以下两点：
// reducers 必须是纯粹的。 这一点和 状态更新函数 是相似的，reducers 在是在渲染时运行的！（actions 会排队直到下一次渲染)。 这就意味着 reducers 必须纯净，即当输入相同时，输出也是相同的。它们不应该包含异步请求、定时器或者任何副作用（对组件外部有影响的操作）。它们应该以不可变值的方式去更新 对象 和 数组。
// 每个 action 都描述了一个单一的用户交互，即使它会引发数据的多个变化。 举个例子，如果用户在一个由 reducer 管理的表单（包含五个表单项）中点击了 重置按钮，那么 dispatch 一个 reset_form 的 action 比 dispatch 五个单独的 set_field 的 action 更加合理。如果你在一个 reducer 中打印了所有的 action 日志，那么这个日志应该是很清晰的，它能让你以某种步骤复现已发生的交互或响应。这对代码调试很有帮助！
