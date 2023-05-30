import React, { useState, useReducer } from 'react'
import { useImmerReducer } from 'use-immer'
import AddTask from './AddTask.jsx'
import TaskList from './TaskList.jsx'

let nextId = 3
const initialTasks = [
  { id: 0, text: '参观卡夫卡博物馆', done: true },
  { id: 1, text: '看木偶戏', done: false },
  { id: 2, text: '打卡列侬墙', done: false }
]
// 使用 Immer 简化 reducers
// 与在平常的 state 中 修改对象 和 数组 一样，你可以使用 Immer 这个库来简化 reducer。在这里，useImmerReducer 让你可以通过 push 或 arr[i] = 来修改 state
export default function TaskApp3() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks)

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

// Reducers 应该是纯净的，所以它们不应该去修改 state。
// 而 Immer 为你提供了一种特殊的 draft 对象，你可以通过它安全的修改 state。
// 在底层，Immer 会基于当前 state 创建一个副本。
// 这就是为什么通过 useImmerReducer 来管理 reducers 时，可以修改第一个参数，且不需要返回一个新的 state 的原因。
function tasksReducer(taskDraft, action) {
  switch (action.type) {
    case 'added':
      taskDraft.push({ id: action.id, text: action.text, done: false })
      break
    case 'changed':
      const index = taskDraft.findIndex((t) => t.id === action.task.id)
      taskDraft[index] = action.task
      break
    case 'deleted':
      return taskDraft.filter((task) => task.id !== action.id)
    default:
      throw Error('未知 action: ' + action.type)
  }
}
