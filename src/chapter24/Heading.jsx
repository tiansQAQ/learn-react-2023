import React, { useContext } from 'react'
import { LevelContext } from './LevelContext'
// 删掉 level 参数并从你刚刚引入的 LevelContext 中读取值：
// useContext 是一个 Hook。和 useState 以及 useReducer一样，你只能在 React 组件中（不是循环或者条件里）立即调用 Hook。
// useContext 告诉 React Heading 组件想要读取 LevelContext。
export default function Heading({ children }) {
  const level = useContext(LevelContext)
  switch (level) {
    case 1:
      return <h1>{children}</h1>
    case 2:
      return <h2>{children}</h2>
    case 3:
      return <h3>{children}</h3>
    case 4:
      return <h4>{children}</h4>
    case 5:
      return <h5>{children}</h5>
    case 6:
      return <h6>{children}</h6>
    default:
      throw Error('未知的 level：' + level)
  }
}
