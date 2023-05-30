import React, { useState } from 'react'
import AddTask from './AddTask.jsx'
import TaskList from './TaskList.jsx'

let nextId = 3
const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
]
// 使用 reducer 整合状态逻辑

// 第 1 步: 将设置状态的逻辑修改成 dispatch 的一个 action

// 移除所有的状态设置逻辑。只留下三个事件处理函数:handleAddTask,handleChangeTask,handleDeleteTask

// 使用 reducers 管理状态与直接设置状态略有不同。它不是通过设置状态来告诉 React “要做什么”，而是通过事件处理程序 dispatch 一个 “action” 来指明 “用户刚刚做了什么”。
//（而状态更新逻辑则保存在其他地方！）因此，我们不再通过事件处理器直接 “设置 task”，而是 dispatch 一个 “添加/修改/删除任务” 的 action。这更加符合用户的思维。
// 你传递给 dispatch 的对象叫做 “action”：
// 它是一个普通的 JavaScript 对象。它的结构是由你决定的，但通常来说，它应该至少包含可以表明 发生了什么事情 的信息。（在后面的步骤中，你将会学习如何添加一个 dispatch 函数。）

// action 对象可以有多种结构。
// 按照惯例，我们通常会添加一个字符串类型的 type 字段来描述发生了什么，并通过其它字段传递额外的信息。type 是特定于组件的，在这个例子中 added 和 addded_task 都可以。选一个能描述清楚发生的事件的名字！
// dispatch({
//   // 针对特定的组件
//   type: 'what_happened'
//   // 其它字段放这里
// })

export default function TaskApp1() {
  // 任务列表
  const [tasks, setTasks] = useState(initialTasks)

  //  在用户点击 “添加” 时被调用
  function handleAddTask(text) {
    dispatch(/*action 对象*/ { type: 'added', id: nextId++, text: text })
  }

  // 在用户切换任务或点击 “保存” 时被调用
  function handleChangeTask(task) {
    dispatch(/*action 对象*/ { type: 'changed', task: task })
  }

  // 在用户点击 “删除” 时被调用。
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

// 第 2 步: 编写一个 reducer 函数

// reducer 函数就是你放置状态逻辑的地方。它接受两个参数，分别为当前 state 和 action 对象，并且返回的是更新后的 state：
// function yourReducer(state, action) {
//   // 给 React 返回更新后的状态
// }

// React 会将状态设置为你从 reducer 返回的状态。

// 在这个例子中，要将状态设置逻辑从事件处理程序移到 reducer 函数中，你需要：

// 1. 声明当前状态（tasks）作为第一个参数；
// 2. 声明 action 对象作为第二个参数；
// 3. 从 reducer 返回 下一个 状态（React 会将旧的状态设置为这个最新的状态）。
// 由于 reducer 函数接受 state（tasks）作为参数，因此你可以 在组件之外声明它。这减少了代码的缩进级别，提升了代码的可读性。
// 下面是所有迁移到 reducer 函数的状态设置逻辑:
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [...tasks, { id: action.id, text: action.text, done: false }]
  } else if (action.type === 'changed') {
    return tasks.map((t) => (t.id === action.task.id ? action.task : t))
  } else if (action.type === 'deleted') {
    return tasks.filter((task) => task.id !== action.id)
  } else {
    throw Error('未知 action: ' + action.type)
  }
}

// 上面的代码使用了 if/else 语句，但是在 reducers 中使用 switch 语句 是一种惯例。两种方式结果是相同的，但 switch 语句读起来一目了然。
// 建议将每个 case 块包装到 { 和 } 花括号中，这样在不同 case 中声明的变量就不会互相冲突。此外，case 通常应该以 return 结尾。如果你忘了 return，代码就会 进入 到下一个 case，这就会导致错误！
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

// 为什么称之为 reducer?
// 尽管 reducer 可以 “减少” 组件内的代码量，但它实际上是以数组上的 reduce() 方法命名的。
// reduce() 允许你将数组中的多个值 “累加” 成一个值：
// const arr = [1, 2, 3, 4, 5]
// const sum = arr.reduce((result, number) => result + number) // 1 + 2 + 3 + 4 + 5

// 你甚至可以使用 reduce() 方法以及 initialState 和 actions 数组，通过传递你的 reducer 函数来计算最终的状态：
//  你可能不需要自己做这些，但这与 React 所做的很相似！
let initialState = []
let actions = [
  { type: 'added', id: 1, text: '参观卡夫卡博物馆' },
  { type: 'added', id: 2, text: '看木偶戏' },
  { type: 'deleted', id: 1 },
  { type: 'added', id: 3, text: '打卡列侬墙' }
]

function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [...tasks, { id: action.id, text: action.text, done: false }]
  } else if (action.type === 'changed') {
    return tasks.map((t) => (t.id === action.task.id ? action.task : t))
  } else if (action.type === 'deleted') {
    return tasks.filter((task) => task.id !== action.id)
  } else {
    throw Error('未知 action: ' + action.type)
  }
}

let finalState = actions.reduce(tasksReducer, initialState)

// [
//     {
//         "id": 2,
//         "text": "看木偶戏",
//         "done": false
//     },
//     {
//         "id": 3,
//         "text": "打卡列侬墙",
//         "done": false
//     }
// ]
console.log('finalState: ', finalState)

// 第 3 步: 在组件中使用 reducer
// 最后，你需要将 tasksReducer 导入到组件中。记得先从 React 中导入 useReducer Hook：
// import { useReducer } from 'react';
// 接下来，你就可以替换掉之前的 useState:
// const [tasks, setTasks] = useState(initialTasks);
// 只需要像下面这样使用 useReducer:
// const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
// useReducer 和 useState 很相似——你必须给它传递一个初始状态，它会返回一个有状态的值和一个设置该状态的函数（在这个例子中就是 dispatch 函数）。但是，它们两个之间还是有点差异的。

// useReducer 钩子接受 2 个参数：

// 1. 一个 reducer 函数
// 2. 一个初始的 state
//  它返回如下内容：

// 1. 一个有状态的值
// 2. 一个 dispatch 函数（用来 “派发” 用户操作给 reducer）
