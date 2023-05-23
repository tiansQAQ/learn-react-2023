import React from 'react'
// 多个组件共享数据，需要将状态从单个按钮“向上”移动到包含所有这些按钮的最接近的组件。
export default function ButtonSharingData({ count, onClick }) {
  return <button onClick={onClick}>Click {count} times</button>
}
