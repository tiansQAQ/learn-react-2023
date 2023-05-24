import React, { useState } from 'react'

import MyButton from './chapter1/MyButton.jsx'
import Profile from './chapter2/Profile.jsx'
import Conditional from './chapter3/Conditional.jsx'
import Products from './chapter4/products.jsx'
import ButtonEvent from './chapter5/ButteonEvent.jsx'
import ButtonState from './chapter6/ButtonState.jsx'
import ButtonSharingData from './chapter7/ButtonSharingData.jsx'
import Pro from './chapter8/Pro.jsx'
import Card from './chapter9/Card.jsx'
import Avatar from './chapter8/Avatar.jsx'
import MyFragment from './chapter10/MyFragment.jsx'
import Toolbar from './chapter11/Toolbar.jsx'
import Gallery from './chapter12/Gallery.jsx'
import Form from './chapter13/Form.jsx'
import Counter from './chapter14/Counter.jsx'
import FormObject from './chapter15/FormObject.jsx'
import BucketList from './chapter16/BucketList.jsx'
import FormObjectImmer from './chapter17/FormObjectImmer.jsx'
import BucketListImmer from './chapter18/BucketListImmer.jsx'
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
      <Pro />
      <Card>
        <Avatar
          size={100}
          person={{
            name: 'Katsuko Saruhashi',
            imageId: 'YfeOqp2'
          }}
        />
      </Card>
      <MyFragment />
      <Toolbar onPlayMovie={() => alert('Playing!')} onUploadImage={() => alert('Uploading')} />
      <Gallery />
      <Form />
      <Counter />
      <FormObject />
      <BucketList />
      <FormObjectImmer />
      <BucketListImmer />
    </>
  )
}
