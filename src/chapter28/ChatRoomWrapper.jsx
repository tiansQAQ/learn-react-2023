import React, { useEffect } from 'react'

// 1. 用户访问 <ChatRoom roomId="general" /> 。让我们在心理上用 'general' 代替 roomId ：
// 2. useEffect也是渲染输出的一部分。第一个渲染的效果变为：['general']。React 运行此效果，它连接到 'general' 聊天室。

// 假设 <ChatRoom roomId="general" /> 重新渲染。JSX 输出是相同的：React 看到渲染输出没有改变，所以它不会更新 DOM。

// React 将第二个渲染的 ['general'] 与第一个渲染的 ['general'] 进行比较。因为所有的依赖都是相同的，所以 React 会忽略第二个渲染中的效果。它永远不会被调用。

// 然后，用户访问 <ChatRoom roomId="travel" /> 。这一次，组件返回不同的 JSX： return <h1>Welcome to travel!</h1>;

// React 更新 DOM 以将 "Welcome to general" 更改为 "Welcome to travel" 。

// 第三个渲染的效果就变成了： ['travel']

// React 将第三个渲染的 ['travel'] 与第二个渲染的 ['general'] 进行比较。一个依赖项是不同的： Object.is('travel', 'general') 是 false 。useEffect无法跳过。

// 在 React 可以从第三个渲染中应用useEffect之前，它需要清理最后一个运行的useEffect。跳过了第二个渲染的useEffect，所以 React 需要清理第一个渲染的效果。如果向上滚动到第一个渲染，您将看到其清理在使用 createConnection('general') 创建的连接上调用 disconnect() 。这会断开应用程序与 'general' 个聊天室的连接。

// 当严格模式打开时，React 会在挂载后重新挂载每个组件一次（状态和 DOM 被保留）。这有助于查找需要清理的效果。此外，React 会在您在开发中保存文件时重新挂载效果。这两种行为都是仅供开发的。
export default function ChatRoomWrapper() {
  return <ChatRoom roomId="general" />
}

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId)
    connection.connect()
    return () => connection.disconnect()
  }, [roomId])

  return <h1>Welcome to {roomId}!</h1>
}
