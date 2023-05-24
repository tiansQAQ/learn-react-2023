import React from 'react'
export function getImageUrl(person, size = 's') {
  return 'https://i.imgur.com/' + person.imageId + size + '.jpg'
}
// 子组件
export default function Pro({ person, size }) {
  return <img src={getImageUrl(person)} alt={person.name} width={size} height={size} />
}
