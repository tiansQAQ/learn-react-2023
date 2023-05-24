import React, { useState } from 'react'

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true }
]

// 数组是另一种可以存在状态中的可变 JavaScript 对象，应将其视为只读。就像对象一样，当你想更新存在状态中的数组时，你需要创建一个新数组（或者复制现有数组），然后用新数组来更新状态。
export default function BucketList() {
  const [list, setList] = useState(initialList)

  function onToggle(item, e) {
    const newList = list.map((el) => {
      if (el.id === item.id) {
        return { ...el, seen: e.target.checked }
      } else {
        return el
      }
    })
    setList(newList)
  }

  const myLi = list.map((item) => {
    return (
      <li key={item.id}>
        <input type="checkbox" checked={item.seen} onChange={(e) => onToggle(item, e)} />
        <label>{item.title}</label>
      </li>
    )
  })

  return <ul>{myLi}</ul>
}
