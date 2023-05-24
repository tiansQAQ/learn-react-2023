import React from 'react'
import { useImmer } from 'use-immer'

// 使用 Immer,useImmer 库来减少重复代码
export default function FormObjectImmer() {
  const [person, setPerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg'
    }
  })

  function handleNameChange(e) {
    setPerson((draft) => {
      draft.name = e.target.value
    })
  }
  function handleTitleChange(e) {
    setPerson((draft) => {
      draft.artwork.title = e.target.value
    })
  }
  function handleCityChange(e) {
    setPerson((draft) => {
      draft.artwork.city = e.target.value
    })
  }
  function handleImageChange(e) {
    setPerson((draft) => {
      draft.artwork.image = e.target.value
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
