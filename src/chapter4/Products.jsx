import React from 'react'
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 }
]

// 列表渲染
export default function Products() {
  const listItems = products.map((product) => (
    <li style={{ color: product.isFruit ? 'magenta' : 'darkgreen' }} key={product.id}>
      {product.title}
    </li>
  ))

  return <ul>{listItems}</ul>
}
