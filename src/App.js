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
import Accordion from './chapter20/Accordion.jsx'
import Counter1 from './chapter21/Counter1.jsx'
import Counter2 from './chapter21/Counter2.jsx'
import Counter3 from './chapter21/Counter3.jsx'
import Counter4 from './chapter21/Counter4.jsx'
import Counter5 from './chapter21/Counter5.jsx'
import Counter6 from './chapter21/Counter6.jsx'
import Counter7 from './chapter21/Counter7.jsx'
import Counter8 from './chapter21/Counter8.jsx'
import Counter9 from './chapter21/Counter9.jsx'
import Counter10 from './chapter21/Counter10.jsx'
import Messenger from './chapter22/Messenger.jsx'

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
      <Accordion />
      <div>
        <Counter1 />
        <Counter1 />
      </div>
      <div>
        <Counter2 />
      </div>
      <div>
        <Counter3 />
      </div>
      <div>
        <Counter4 />
      </div>
      <div>
        <Counter5 />
      </div>
      <div>
        <Counter6 />
      </div>
      <div>
        <Counter7 />
      </div>
      <div>
        <Counter8 />
      </div>
      <div>
        <Counter9 />
      </div>
      <div>
        <Counter10 />
      </div>
      <Messenger />
    </>
  )
}
