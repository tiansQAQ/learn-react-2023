import React, { useState } from 'react'

import MyButton from './chapter1/MyButton.jsx'
import Profile from './chapter2/Profile.jsx'
import Conditional from './chapter3/Conditional.jsx'
import Products from './chapter4/products.jsx'
import ButtonEvent from './chapter5/ButteonEvent.jsx'
import ButtonState from './chapter6/ButtonState.jsx'
import ButtonSharingData from './chapter7/ButtonSharingData.jsx'
export default function App() {
  // 多个组件共享数据
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }

  return (
    <>
      <h1>Welcome to my app</h1>
      <MyButton />
      <Profile />
      <Conditional />
      <Products />
      <ButtonEvent />
      <div>
        <ButtonState />
        <ButtonState />
      </div>
      <div>
        <ButtonSharingData count={count} onClick={handleClick} />
        <ButtonSharingData count={count} onClick={handleClick} />
      </div>
    </>
  )
}
