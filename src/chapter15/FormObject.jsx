import React, { useState } from 'react'

// 更新状态中的对象

// 状态可以持有任何类型的 JavaScript 值，包括对象。不应该直接改变你在 React 状态中持有的对象和数组。更新一个对象和数组时，需要创建一个新的对象（或复制现有的对象），然后用这个副本来更新状态。

// 通常情况下，你会使用 ... 展开语法来复制你想改变的对象和数组
export default function FormObject() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg'
    }
  })

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    })
  }
  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    })
  }
  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    })
  }
  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    })
  }

  return (
    <>
      <label>
        name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        city:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>{person.artwork.title}</p>
      <p>{person.name}</p>
      <p>{person.artwork.city}</p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
  )
}
