import React, { useEffect, useRef, useState } from 'react'

export default function VideoPlayerWrapper() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
      <VideoPlayer isPlaying={isPlaying} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
    </>
  )
}

// 默认情况下，useEffect在每次渲染后运行。这就是为什么这样的代码会产生无限循环的原因：
/**
 *
 * const [count, setCount] = useState(0);
 *    useEffect(() => {
 *     setCount(count + 1);
 * });
 */

// useEffect作为渲染的结果运行。设置状态会触发呈现。在useEffect中立即设置状态就像将电源插座插入自身一样。useEffect运行，它设置状态，这会导致重新渲染，这会导致useEffect运行，它再次设置状态，这会导致另一个重新渲染，依此类推。

// useEffect通常应将组件与外部系统同步。如果没有外部系统，而您只想根据其他状态调整某些状态，则可能不需要useEffect。
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null)

  // 第一次调用 VideoPlayer 时，它的 DOM 还不存在！目前还没有一个 DOM 节点可以调用 play() 或 pause() ，因为 React 在你返回 JSX 之前不知道要创建什么 DOM。
  // 解决方案是用 useEffect 包装，以将其移出渲染计算：
  // 通过将 DOM 更新包装在useEffect中，您可以让 React 首先更新屏幕。然后你的效果运行。
  useEffect(() => {
    console.log('video执行')
    isPlaying ? ref.current.play() : ref.current.pause()
  })

  return <video ref={ref} src={src} loop playsInline />
}
