import React, { useState } from 'react'
import { useTasksDispatch } from './TasksContext.js'

let nextId = 3

export default function AddTask() {
  const [taskText, setTaskText] = useState('')
  const dispatch = useTasksDispatch()

  return (
    <div>
      <input type="text" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
      <button
        onClick={() => {
          dispatch({ type: 'added', id: nextId++, text: taskText })
          setTaskText('')
        }}
      >
        添加
      </button>
    </div>
  )
}
