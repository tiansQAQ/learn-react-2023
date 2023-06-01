import React from 'react'

// 如何处理开发中两次的Effect执行

// React 有意在开发中重新挂载组件以查找错误，正确的问题不是“如何运行一次Effect”，而是“如何修复我的Effect，使其在重新安装后正常工作”。

// 通常，答案是实现清理功能。 清理功能应停止或撤消效果正在执行的任何操作。经验法则是，用户不应能够区分运行一次的 Effect（如在生产中）和设置→清理→设置序列（如您在开发中看到的那样）。

// 您将编写的大多数效果都适合以下常见模式之一。

// 1. 控制非 React 小部件：

// 有时你需要添加未写入 React 的 UI 小部件。例如，假设您要向页面添加地图组件。它有一个 setZoomLevel() 方法，并且您希望使缩放级别与 React 代码中的 zoomLevel 状态变量保持同步。您的效果将如下所示：
// useEffect(() => {
//   const map = mapRef.current
//   map.setZoomLevel(zoomLevel)
// }, [zoomLevel])

// 请注意，在这种情况下不需要清理。在开发中，React 会调用 Effect 两次，但这不是问题，因为用相同的值调用 setZoomLevel 两次不会做任何事情。
// 它可能稍微慢一些，但这并不重要，因为它不会在生产中不必要地重新装载。

// 某些 API 可能不允许连续调用它们两次。例如，内置 <dialog> 元素的 showModal 方法在调用两次时会抛出。实现清理功能并使其关闭对话框：

// useEffect(() => {
//   const dialog = dialogRef.current
//   dialog.showModal()
//   return () => dialog.close()
// }, [])
// 在开发中，useEffect将调用 showModal() ，然后立即调用 close() ，然后再次调用 showModal() 。这与调用 showModal() 一次具有相同的用户可见行为，正如您在生产中看到的那样。

// 2. 订阅事件

// 如果您的useEffect订阅了某些内容，清理功能应取消订阅：

// useEffect(() => {
//   function handleScroll(e) {
//     console.log(window.scrollX, window.scrollY)
//   }
//   window.addEventListener('scroll', handleScroll)
//   return () => window.removeEventListener('scroll', handleScroll)
// }, [])

// 在开发中，Effect 将使用相同的处理程序调用 addEventListener() ，然后立即调用 removeEventListener() ，然后再次调用 addEventListener() 。
// 因此，一次只有一个事件订阅。这与在生产环境中调用 addEventListener() 一次具有相同的用户可见行为。

// 3. 触发动画

// 如果 Effect 在其中对某些内容进行动画处理，则清理函数应将动画重置为初始值：
// useEffect(() => {
//   const node = ref.current
//   node.style.opacity = 1 // Trigger the animation
//   return () => {
//     node.style.opacity = 0 // Reset to the initial value
//   }
// }, [])

// 在开发中，不透明度将设置为 1 ，然后设置为 0 ，然后再次设置为 1 。
// 这应该具有与直接将其设置为 1 相同的用户可见行为，这是在生产中会发生的情况。
// 如果使用支持补间的第三方动画库，则清理函数应将时间轴重置为其初始状态。

// 4. 获取数据

// 如果您的 Effect 获取了某些内容，则清理函数应该中止获取或忽略其结果：

// useEffect(() => {
//   let ignore = false
//   async function startFetching() {
//     const json = await fetchTodos(userId)
//     if (!ignore) {
//       setTodos(json)
//     }
//   }
//   startFetching()
//   return () => {
//     ignore = true
//   }
// }, [userId])

// 您无法“撤消”已经发生的网络请求，但清理功能应确保不再相关的提取不会继续影响您的应用程序。
// 如果 userId 从 'Alice' 更改为 'Bob' ，则清理可确保忽略 'Alice' 响应，即使它在 'Bob' 之后到达。

// 在生产中，只有一个请求。

// 在Effect中获取数据有哪些好的替代方案？

// 在Effect中写入 fetch 调用是一种常用的数据获取方式，尤其是在完全客户端的应用中。但是，这是一种非常手动的方法，并且具有明显的缺点：

// 1. 这意味着初始服务器呈现的 HTML 将仅包含没有数据的加载状态。客户端计算机必须下载所有 JavaScript 并呈现您的应用程序，只是为了发现现在它需要加载数据。这不是很有效。
// 2. 您呈现父组件，它提取一些数据，呈现子组件，然后它们开始提取其数据。如果网络不是很快，这比并行获取所有数据要慢得多。
// 3. 例如，如果组件卸载然后再次装载，则必须再次获取数据。
// 4. 当以不受错误困扰的方式编写 fetch 调用时，涉及相当多的样板代码。

// 这个缺点列表并不是特定于 React 的。它适用于使用任何库在装载时获取数据。与路由一样，数据获取并非易事，因此我们建议使用以下方法：

// 1. 如果使用，请使用其内置的数据提取机制。现代 React 框架集成了高效的数据获取机制，并且不受上述陷阱的影响。
// 2. 流行的开源解决方案包括 React Query, useSWR, and React Router 6.4+。您也可以构建自己的解决方案，在这种情况下，您可以在后台使用 Effects，但添加用于删除重复数据请求、缓存响应和避免网络瀑布的逻辑（通过预加载数据或将数据要求提升到路由）。

// 如果这两种方法都不适合您，您可以继续直接在Effect中获取数据。

// 非Effect：初始化应用程序

// 1. 某些逻辑只应在应用程序启动时运行一次。您可以将其放在组件之外：

// if (typeof window !== 'undefined') {
//   // Check if we're running in the browser.
//   checkAuthToken()
//   loadDataFromLocalStorage()
// }

// function App() {
//   // ...
// }

// 这保证了此类逻辑在浏览器加载页面后仅运行一次。

// 无效Effect：购买产品

// 有时，即使您编写了清理函数，也无法防止用户看到运行 Effect 两次的后果。例如，您的效果可能会发送一个 POST 请求，例如购买产品：

// useEffect(() => {
//   // 🔴 Wrong: 这个 Effect 在开发中触发了两次，暴露了代码中的问题。
//   fetch('/api/buy', { method: 'POST' })
// }, [])

// 您不会想购买该产品两次。但是，这也是您不应该将此逻辑放在效果中的原因。
// 如果用户转到另一个页面，然后按“返回”，该怎么办？您的效果将再次运行。
// 您不想在用户访问页面时购买产品;您希望在用户单击“购买”按钮时购买它。

// 购买不是由渲染引起的;它是由特定的交互引起的。
// 它应仅在用户按下按钮时运行。请求移动到“购买”按钮事件处理程序中：

// function handleClick() {
//   // ✅ 购买是一个事件，因为它是由特定的交互引起的。
//   fetch('/api/buy', { method: 'POST' })
// }

// 这说明，如果重新挂载破坏了应用程序的逻辑，这通常会发现现有的错误。
// 从用户的角度来看，访问页面不应与访问页面、单击链接并按“返回”没有什么不同。
// React 通过在开发中重新挂载它们来验证您的组件是否符合此原则。
export default function EffectTwice() {
  return <div>EffectTwice</div>
}
