import React, { useRef } from 'react'
// 使用 ref 操作 DOM

// 由于 React 会自动处理更新 DOM 以匹配你的渲染输出，因此你在组件中通常不需要操作 DOM。
// 但是，有时你可能需要访问由 React 管理的 DOM 元素 —— 例如，让一个节点获得焦点、滚动到它或测量它的尺寸和位置。
// 在 React 中没有内置的方法来做这些事情，所以你需要一个指向 DOM 节点的 ref 来实现。

export default function MyDOMRef() {
  // useRef Hook 返回一个对象，该对象有一个名为 current 的属性。最初，myRef.current 是 null。
  // 当 React 为这个 <div> 创建一个 DOM 节点时，React 会把对该节点的引用放入 myRef.current。
  // 然后，你可以从 事件处理器 访问此 DOM 节点，并使用在其上定义的内置浏览器 API。
  const myRef = useRef(null)

  // 你可以使用任意浏览器 API，例如：
  // myRef.current.scrollIntoView()

  // 最后，将你的 ref 作为 ref 属性传递给你想要获取 DOM 节点的 JSX 标签：
  return <div ref={myRef}>FormRef</div>
}
