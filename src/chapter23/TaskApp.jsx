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
// 随着组件复杂度的增加，你将很难一眼看清所有的组件状态更新逻辑。例如，下面的 TaskApp 组件有一个数组类型的状态 tasks，并通过三个不同的事件处理程序来实现任务的添加、删除和修改：
export default function TaskApp() {
  // 任务列表
  const [tasks, setTasks] = useState(initialTasks)

  function handleAddTask(text) {
    const newTasks = [...tasks, { id: nextId++, text: text, done: false }]
    setTasks(newTasks)
  }

  function handleChangeTask(task) {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t))
    setTasks(newTasks)
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }
  return (
    <>
      <h1>布拉格的行程安排</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onChangeTask={handleChangeTask} onDeleteTask={handleDeleteTask} />
    </>
  )
}
