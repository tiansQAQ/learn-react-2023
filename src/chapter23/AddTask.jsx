import React, { useState } from 'react'

export default function AddTask({ onAddTask }) {
  const [taskText, setTaskText] = useState('')

  return (
    <div>
      <input type="text" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
      <button
        onClick={() => {
          onAddTask(taskText)
          setTaskText('')
        }}
      >
        添加
      </button>
    </div>
  )
}
