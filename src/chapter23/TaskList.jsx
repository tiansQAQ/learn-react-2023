import React, { useState } from 'react'
import Task from './Task.jsx'
export default function TaskList({ tasks, onChangeTask, onDeleteTask }) {
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <li key={task.id}>
            <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
          </li>
        )
      })}
    </ul>
  )
}
