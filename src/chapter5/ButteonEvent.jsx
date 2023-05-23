import React from 'react'

// 响应事件
export default function ButtonEvent() {
  function handleClick() {
    alert('You clicked me!')
  }
  return <button onClick={handleClick}>Click me</button>
}
