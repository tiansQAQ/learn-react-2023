import React, { useState } from 'react'

export default function Form() {
  const [to, setTo] = useState('zhangsan')
  const [message, setMessage] = useState('Hello')
  function handleSubmit(e) {
    e.preventDefault()
    setTimeout(() => {
      // 如果先按下“发送”，然后再把收件人改为 lisi，会发生什么？五秒钟后弹出窗口zhangsan
      alert(`You said ${message} to ${to}`)
    }, 5000)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>To :</label>
      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="zhangsan">zhangsan</option>
        <option value="lisi">lisi</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
      <button type="submit">Send</button>
    </form>
  )
}
