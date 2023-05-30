import React, { useReducer } from 'react'
import AddTask from './AddTask.jsx'
import TaskList from './TaskList.jsx'
import { TasksContext, TasksDispatchContext } from './TasksContext.js'

const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
]

// 使用 Reducer 和 Context 来拓展你的应用

// Reducer 可以整合组件的状态更新逻辑。Context 可以将信息深入传递给其他组件。你可以组合使用它们来共同管理一个复杂页面的状态。

// 结合使用 reducer 和 context

// Reducer 有助于保持事件处理程序的简短明了。但随着应用规模越来越庞大，你就可能会遇到别的困难。
// 目前，tasks 状态和 dispatch 函数仅在顶级 TaskApp 组件中可用。
// 要让其他组件读取任务列表或更改它，你必须显式 传递 当前状态和将其更改为 props 的事件处理程序。

// 在像这样的小示例里这样做没什么问题，但是如果你有成千上百个组件，传递所有状态和函数可能会非常麻烦！

// 这就是为什么，比起通过 props 传递它们，你可能想把 tasks 状态和 dispatch 函数都 放入 context。
// 这样，所有的在 TaskApp 组件树之下的组件都不必一直往下传 props 而可以直接读取 tasks 和 dispatch 函数。

// 下面将介绍如何结合使用 reducer 和 context：

// 1. 创建 context。
// 2. 将 state 和 dispatch 放入 context。
// 3. 在组件树的任何地方 使用 context。

// 第一步: 创建 context: TasksContext.js

// 第二步: 将 state 和 dispatch 函数 放入 context

// 现在，你可以将所有的 context 导入 TaskApp 组件。获取 useReducer() 返回的 tasks 和 dispatch 并将它们 提供 给整个组件树

// 第三步：将删除通过 props 传递的代码，在组件树中的任何地方使用 context：TaskList.jsx  AddTask.jsx

// state 仍然 “存在于” 顶层 Task 组件中，由 useReducer 进行管理。不过，组件树里的组件只要导入这些 context 之后就可以获取 tasks 和 dispatch。

// 将相关逻辑迁移到一个文件当中

// 这不是必须的，但你可以通过将 reducer 和 context 移动到单个文件中来进一步整理组件。目前，“TasksContext.js” 仅包含两个 context 声明。

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id)
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
