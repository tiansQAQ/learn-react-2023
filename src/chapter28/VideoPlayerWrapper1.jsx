import React, { useEffect, useRef, useState } from 'react'

// 默认情况下，Effect在每次渲染后运行。通常，这不是您想要的：

// 1. 有时，它很慢。与外部系统同步并不总是即时的，因此除非必要，否则您可能希望跳过同步。例如，您不希望每次击键都重新连接到聊天服务器。
// 2. 有时，这是错误的。例如，您不希望在每次击键时触发组件淡入动画。动画只应在组件首次出现时播放一次。
export default function VideoPlayerWrapper() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [text, setText] = useState('')

  return (
    <>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
      <VideoPlayer isPlaying={isPlaying} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
    </>
  )
}

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null)

  // 父组件输入框改变就会执行
  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()')
      ref.current.play()
    } else {
      console.log('Calling video.pause()')
      ref.current.pause()
    }
  })

  return <video ref={ref} src={src} loop playsInline />
}
