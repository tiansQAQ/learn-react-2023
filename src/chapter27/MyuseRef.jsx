import React from 'react'

// useRef 内部是如何运行的？
// 尽管 useState 和 useRef 都是由 React 提供的，原则上 useRef 可以在 useState 的基础上 实现。
// 你可以想象在 React 内部，useRef 是这样实现的：

// 第一次渲染期间，useRef 返回 { current: initialValue }。 该对象由 React 存储，因此在下一次渲染期间将返回相同的对象。
// 请注意，在这个示例中，state 设置函数没有被用到。它是不必要的，因为 useRef 总是需要返回相同的对象！

// React 提供了一个内置版本的 useRef，因为它在实践中很常见。
// 但是你可以将其视为没有设置函数的常规 state 变量。
// 如果你熟悉面向对象编程，ref 可能会让你想起实例字段 —— 但是你写的不是 this.something，而是 somethingRef.current。

// 何时使用 ref

// 通常，当你的组件需要“跳出” React 并与外部 API 通信时，你会用到 ref —— 通常是不会影响组件外观的浏览器 API。以下是这些罕见情况中的几个：

// 1. 存储 timeout ID
// 2. 存储和操作 DOM 元素，我们将在 下一页 中介绍
// 3. 存储不需要被用来计算 JSX 的其他对象。
// 4. 如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 ref。

// ref 的最佳实践

// 遵循这些原则将使你的组件更具可预测性：

// 1. 将 ref 视为应急方案。 当你使用外部系统或浏览器 API 时，ref 很有用。如果你很大一部分应用程序逻辑和数据流都依赖于 ref，你可能需要重新考虑你的方法。
// 2. 不要在渲染过程中读取或写入 ref.current。 如果渲染过程中需要某些信息，请使用 state 代替。由于 React 不知道 ref.current 何时发生变化，即使在渲染时读取它也会使组件的行为难以预测。（唯一的例外是像 if (!ref.current) ref.current = new Thing() 这样的代码，它只在第一次渲染期间设置一次 ref。）

// React state 的限制不适用于 ref。例如，state 就像 每次渲染的快照，并且 不会同步更新。但是当你改变 ref 的 current 值时，它会立即改变：

// ref 和 DOM

// 你可以将 ref 指向任何值。但是，ref 最常见的用法是访问 DOM 元素。
// 例如，如果你想以编程方式聚焦一个输入框，这种用法就会派上用场。
// 当你将 ref 传递给 JSX 中的 ref 属性时，比如 <div ref={myRef}>，React 会将相应的 DOM 元素放入 myRef.current 中。

// React 内部
export default function MyUseRef() {
  const [ref, unused] = useState({ current: initialValue })
  return ref
}
