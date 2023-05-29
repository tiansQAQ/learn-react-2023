import React, { useState } from 'react'
import Counter1 from './Counter1.jsx'

// 记住 对 React 来说重要的是组件在 UI 树中的位置,而不是在 JSX 中的位置！ 这个组件在 if 内外有两个return 语句，它们带有不同的 <Counter /> JSX 标签：
// 你可能以为当你勾选复选框的时候 state 会被重置，但它并没有！这是因为 两个 <Counter /> 标签被渲染在了相同的位置。 React 不知道你的函数里是如何进行条件判断的，它只会“看到”你返回的树。在这两种情况下，App 组件都会返回一个包裹着 <Counter /> 作为第一个子组件的 div。这就是 React 认为它们是 同一个 <Counter /> 的原因。
// 你可以认为它们有相同的“地址”：根组件的第一个子组件的第一个子组件。不管你的逻辑是怎么组织的，这就是 React 在前后两次渲染之间将它们进行匹配的方式。
export default function Counter4() {
  const [isFancy, setIsFancy] = useState(false)
  if (isFancy) {
    return (
      <div>
        <Counter1 isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={(e) => {
              setIsFancy(e.target.checked)
            }}
          />
          使用好看的样式
        </label>
      </div>
    )
  }
  return (
    <div>
      <Counter1 isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  )
}
