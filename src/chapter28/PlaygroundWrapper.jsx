import React, { useState, useEffect } from 'react'

// 将一切整合在一起

// 这个游乐场可以帮助您“感受”Effect在实践中的工作方式。

// 此示例使用 setTimeout 计划控制台日志，其中输入文本在效果器运行三秒后显示。清理功能取消挂起的超时。

// 您将首先看到三个日志： Start "a" log 、 Cancel "a" log 和 Schedule "a" log 。三秒钟后，还会有一条日志说 a 。
// 正如你之前所知道的，额外的调度/取消对是因为 React 在开发过程中重新挂载组件，以验证你是否很好地实现了清理。

// 在编辑输入以显示 abc 。如果你做得足够快，你会看到 Start "ab" log 紧跟 Cancel "ab" log 和 Start "abc" log 。
// React 总是在下一个渲染的效果之前清理上一个渲染的效果。这就是为什么即使您快速输入输入，一次最多安排一个超时。编辑输入几次并观看控制台，以了解效果是如何清理的。

// 在输入中键入内容，然后立即按“卸载组件”。请注意卸载如何清理上次渲染的效果。在这里，它会触发之前清除最后一次超时。

// 每个渲染都有自己的Effect

export default function PlaygroundWrapper() {
  const [show, setShow] = useState(false)
  return (
    <>
      <button onClick={() => setShow(!show)}>{show ? 'Unmount' : 'Mount'} the component</button>
      {show && <hr />}
      {show && <Playground />}
    </>
  )
}

function Playground() {
  const [text, setText] = useState('a')
  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text)
    }
    console.log('🔵 Start "' + text + '" log')
    const timeoutId = setTimeout(onTimeout, 3000)

    return () => {
      console.log('Cancel "' + text + '" log')
      clearTimeout(timeoutId)
    }
  }, [text])

  return (
    <>
      <label>
        What to log: <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <h1>{text}</h1>
    </>
  )
}
