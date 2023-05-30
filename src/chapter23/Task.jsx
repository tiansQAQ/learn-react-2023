import React, { useState } from 'react'
export default function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <label>
      <input type="checkbox" checked={task.done} onChange={(e) => onChange({ ...task, done: e.target.checked })} />
      {isEditing ? (
        <>
          <input type="text" value={task.text} onChange={(e) => onChange({ ...task, text: e.target.value })} />
          <button onClick={() => setIsEditing(false)}>保存</button>
        </>
      ) : (
        <>
          {task.text}
          <button onClick={() => setIsEditing(true)}>编辑</button>
        </>
      )}

      <button onClick={() => onDelete(task.id)}>删除</button>
    </label>
  )
}
