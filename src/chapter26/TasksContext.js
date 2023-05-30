import { createContext, useReducer, useContext } from 'react'

// 为了将它们从组件树往下传，你将 创建 两个不同的 context：

// TasksContext 提供当前的 tasks 列表。
// TasksDispatchContext 提供了一个函数可以让组件分发动作。

// 在这里，你把 null 作为默认值传递给两个 context。实际值是由 TaskApp 组件提供的。
export const TasksContext = createContext(null)
export const TasksDispatchContext = createContext(null)

// 来给这个文件添加更多代码！将 reducer 移动到此文件中，然后声明一个新的 TasksProvider 组件。此组件将所有部分连接在一起：

// 它将管理 reducer 的状态。
// 它将提供现有的 context 给组件树。
// 它将 把 children 作为 prop，所以你可以传递 JSX。

// 你可以将 TasksProvider 视为页面的一部分，它知道如何处理 tasks。useTasks 用来读取它们，useTasksDispatch 用来从组件树下的任何组件更新它们。

// 像 useTasks 和 useTasksDispatch 这样的函数被称为 自定义 Hook。 如果你的函数名以 use 开头，它就被认为是一个自定义 Hook。这让你可以使用其他 Hook，比如 useContext。

// 随着应用的增长，你可能会有许多这样的 context 和 reducer 的组合。这是一种强大的拓展应用并 提升状态 的方式，让你在组件树深处访问数据时无需进行太多工作。
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

// 你也可以从 TasksContext.js 中导出使用 context 的函数：
// 组件可以通过以下函数读取 context：
// const tasks = useTasks()
// const dispatch = useTasksDispatch()

// 这不会改变任何行为，但它会允许你之后进一步分割这些 context 或向这些函数添加一些逻辑。现在所有的 context 和 reducer 连接部分都在 TasksContext.js 中。这保持了组件的干净和整洁，让我们专注于它们显示的内容，而不是它们从哪里获得数据：
export function useTasks() {
  return useContext(TasksContext)
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext)
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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
]
