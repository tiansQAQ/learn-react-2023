import React, { useEffect } from 'react'
// 根据需要添加清理

// 考虑一个不同的例子。您正在编写一个 ChatRoom 组件，该组件需要在聊天服务器出现时连接到聊天服务器。
// 您将获得一个 createConnection() 个 API，该 API 返回具有 connect() 和 disconnect() 个方法的对象。
// 如何在向用户显示组件时保持连接？

// 1. 首先编写效果逻辑
// 2. 添加依赖项数组。Effect中的代码不使用任何属性或状态，因此依赖项数组为[]。这告诉 React 只在组件“挂载”时运行这段代码，即第一次出现在屏幕上。
export default function ChatRoom() {
  // 在开发测试环境中，React 会在初始挂载后立即重新挂载每个组件一次。也就是说useEffect执行了两次。

  // 当组件卸载时，您的代码不会关闭连接。要解决此问题，要从useEffect返回清理函数：
  // React 每次都会在 Effect 再次运行之前调用你的清理函数，最后一次在组件卸载（被删除）时调用。让我们看看实现清理功能时会发生什么：

  // 1. "✅ Connecting..."
  // 2. "❌ Disconnected."
  // 3. "✅ Connecting..."

  // 这是开发中的正确行为。通过重新挂载你的组件，React 会验证离开和返回导航不会破坏你的代码。
  // 断开连接然后再次连接正是应该发生的事情！当您很好地实现清理时，运行一次效果与运行它、清理它和再次运行它之间应该没有用户可见的区别。
  // 有一个额外的连接/断开连接调用对，因为 React 正在探测您的代码是否存在开发中的错误。这是正常的 - 不要试图让它消失！
  // 在生产中，您只会看到 "✅ Connecting..." 打印一次。重新挂载组件仅在开发中发生，以帮助您找到需要清理的效果。您可以关闭严格模式以选择退出开发行为，但我们建议您保持打开状态。这使您可以找到许多类似于上面的错误。
  useEffect(() => {
    const connection = createConnection()
    connection.connect()
    return () => {
      connection.disconnect()
    }
  }, [])

  return <h1>Welcome to the chat!</h1>
}

function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...')
    },
    disconnect() {
      console.log('❌ Disconnected.')
    }
  }
}
