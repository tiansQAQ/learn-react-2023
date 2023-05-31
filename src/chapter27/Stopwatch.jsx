import React, { useState, useRef } from 'react'
// 可以把 ref 和 state 结合起来使用。
// 例如，让我们制作一个秒表，用户可以通过按按钮来使其启动或停止。
// 为了显示从用户按下“开始”以来经过的时间长度，你需要追踪按下“开始”按钮的时间和当前时间。
// 此信息用于渲染，所以你会把它保存在 state 中：
// 当用户按下“开始”时，你将用 setInterval 每 10 毫秒更新一次时间：
// 当按下“停止”按钮时，你需要取消现有的 interval，以便让它停止更新 now state 变量。
// 你可以通过调用 clearInterval 来完成此操作。
// 但你需要为其提供 interval ID，此 ID 是之前用户按下 Start、调用 setInterval 时返回的。你需要将 interval ID 保留在某处。 由于 interval ID 不用于渲染，你可以将其保存在 ref 中：
// 当一条信息用于渲染时，将它保存在 state 中。当一条信息仅被事件处理器需要，并且更改它不需要重新渲染时，使用 ref 可能会更高效。

/**
 * ref 和 state 的不同之处
 * 也许你觉得 ref 似乎没有 state 那样“严格” —— 例如，你可以改变它们而非总是必须使用 state 设置函数。
 * 但在大多数情况下，我们建议你使用 state。ref 是一个“应急方案”，你并不会经常用到它。 以下是 state 和 ref 的对比：
 * ref
 *  1. useRef(initialValue) 返回 { current: initialValue }
 *  2. 更改时不会触发重新渲染
 *  3. 可变 —— 你可以在渲染过程之外修改和更新 current 的值。
 *  4.  你不应在渲染期间读取（或写入） current 值。
 * state
 *  1. useState(initialValue) 返回 state 变量的当前值和一个 state 设置函数 ( [value, setValue])
 *  2. 更改时触发重新渲染。
 *  3. “不可变” —— 你必须使用 state 设置函数来修改 state 变量，从而排队重新渲染。
 *  4. 你可以随时读取 state。但是，每次渲染都有自己不变的 state 快照。
 */

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)
  const intervalRef = useRef(null)

  function handleStart() {
    // 开始计时。
    setStartTime(Date.now())
    setNow(Date.now())

    clearInterval(intervalRef.current)
    // 每 10ms 更新一次当前时间。
    intervalRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  function handleStop() {
    clearInterval(intervalRef.current)
  }

  let secondsPassed = 0
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000
  }

  return (
    <>
      <h1>时间过去了： {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>开始</button>
      <button onClick={handleStop}>停止</button>
    </>
  )
}
