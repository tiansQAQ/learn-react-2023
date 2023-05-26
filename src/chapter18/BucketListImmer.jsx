import React from 'react'
import { useImmer } from 'use-immer'

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true }
]
// 使用 Immer,useImmer 库来减少重复代码
export default function BucketListImmer() {
  const [list, setList] = useImmer(initialList)

  function onToggle(item, e) {
    setList((draft) => {
      const artwork = draft.find((el) => el.id === item.id) || {}
      artwork.seen = e.target.checked
    })
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
