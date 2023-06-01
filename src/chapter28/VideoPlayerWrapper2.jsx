import React, { useEffect, useRef, useState } from 'react'

// 告诉 React 跳过不必要的重新运行 Effect，方法是指定一个依赖项数组作为 useEffect 调用的第二个参数。添加一个空的 [] 数组：
// 没有依赖关系数组和具有空 [] 依赖关系数组的行为是不同的：

/**
 * 

  useEffect(() => {
    // This runs after every render
  })

  useEffect(() => {
    // This runs only on mount (when the component appears)
  }, [])

  useEffect(() => {
    // This runs on mount *and also* if either a or b have changed since the last render
  }, [a, b])

*/

export default function VideoPlayerWrapper2() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [text, setText] = useState('')
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
      <VideoPlayer isPlaying={isPlaying} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
    </>
  )
}

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null)
  // Effect 中的代码依赖于 isPlaying prop 来决定做什么，但这种依赖关系没有明确声明。若要解决此问题，请将 isPlaying 添加到依赖项数组：

  // 现在声明了所有依赖项，因此没有错误。指定 [isPlaying] 作为依赖数组告诉 React ，如果 isPlaying 与上次渲染期间相同，它应该跳过重新运行 Effect。通过此更改，在输入中键入不会导致效果重新运行，但按播放/暂停会导致。

  // 依赖项数组可以包含多个依赖项。只有当你指定的所有依赖项都具有与上一个渲染期间完全相同的值时，React 才会跳过重新运行 Effect。React 使用 Object.is 比较来比较依赖关系值。有关详细信息，请参阅 useEffect 参考。

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()')
      ref.current.play()
    } else {
      console.log('Calling video.pause()')
      ref.current.pause()
    }
  }, [isPlaying])

  return <video ref={ref} src={src} loop playsInline />
}

/**
 *
 * 为什么从依赖数组中省略了ref？
 * 此效果同时使用 ref 和 isPlaying ，但只有 isPlaying 声明为依赖项：
 *  function VideoPlayer({ src, isPlaying }) {
      const ref = useRef(null);
      useEffect(() => {
        if (isPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
    }, [isPlaying]);

 *
 * 这是因为 ref 对象具有稳定的标识：React 保证在每次渲染时，您始终会从相同的 useRef 调用中获得相同的对象。
 * 它永远不会改变，因此它本身永远不会导致效果重新运行。因此，是否包含它并不重要。包括它也很好：
 * 
 *  function VideoPlayer({ src, isPlaying }) {
      const ref = useRef(null);
      useEffect(() => {
        if (isPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
    }, [isPlaying,ref]);

 *   useState 返回的 set 函数也具有稳定的标识，因此您经常会看到它们也从依赖项中被省略。如果 linter 允许您省略依赖项而没有错误，则这样做是安全的。
 * 
 *   仅当 linter 可以“看到”对象是稳定的时，省略始终稳定的依赖项才有效。
 *   例如，如果 ref 是从父组件传递的，则必须在依赖项数组中指定它。
 *   但是，这很好，因为您无法知道父组件是否总是传递相同的 ref，或者有条件地传递多个 ref 之一。因此，您的效果将取决于传递的引用。
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
