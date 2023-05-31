import React, { useRef } from 'react'

// 当你希望组件“记住”某些信息，但又不想让这些信息 触发新的渲染 时，你可以使用 ref 。
// 在你的组件内，调用 useRef Hook 并传入你想要引用的初始值作为唯一参数。例如，这里的 ref 引用的值是“0”：
// useRef 返回一个这样的对象: { current: 0 // 你向 useRef 传入的值 }

// 你可以用 ref.current 属性访问该 ref 的当前值。
// 这个值是有意被设置为可变的，意味着你既可以读取它也可以写入它。
// 就像一个 React 追踪不到的、用来存储组件信息的秘密“口袋”。

// 下面代码每次点击按钮时会使 ref.current 递增：

// 请注意，组件不会在每次递增时重新渲染。 与 state 一样，React 会在每次重新渲染之间保留 ref。但是，设置 state 会重新渲染组件，更改 ref 不会！
export default function CounterRef() {
  // 这里的 ref 指向一个数字，但是，像 state 一样，你可以让它指向任何东西：字符串、对象，甚至是函数。
  // 与 state 不同的是，ref 是一个普通的 JavaScript 对象，具有可以被读取和修改的 current 属性。
  let ref = useRef(0)
  function handleClick() {
    ref.current = ref.current + 1
    alert('你点击了 ' + ref.current + ' 次！')
  }

  return <button onClick={handleClick}>点击我</button>
}
