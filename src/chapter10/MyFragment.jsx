import React, { Fragment } from 'react'

const people = [
  {
    id: 0, // 在 JSX 中作为 key 使用
    name: '凯瑟琳·约翰逊',
    profession: '数学家',
    accomplishment: '太空飞行相关数值的核算',
    imageId: 'MK3eW3A'
  },
  {
    id: 1, // 在 JSX 中作为 key 使用
    name: '马里奥·莫利纳',
    profession: '化学家',
    accomplishment: '北极臭氧空洞的发现',
    imageId: 'mynHUSa'
  },
  {
    id: 2, // 在 JSX 中作为 key 使用
    name: '穆罕默德·阿卜杜勒·萨拉姆',
    profession: '物理学家',
    accomplishment: '关于基本粒子间弱相互作用和电磁相互作用的统一理论',
    imageId: 'bE7W1ji'
  }
]

// Fragment 语法的简写形式 <> </> 无法接受 key 值，只能把生成的节点用一个 <div> 标签包裹起来，要么使用长一点但更明确的 <Fragment> 写法：
// 这里的 Fragment 标签本身并不会出现在 DOM 上，这串代码最终会转换成 <h1>、<p>、<h1>、<p>…… 的列表。

export default function MyFragment() {
  const listItem = people.map((person) => {
    return (
      <Fragment key={person.id}>
        <h1>{person.name}</h1>
        <p>{person.accomplishment}</p>
      </Fragment>
    )
  })
  return <ul>{listItem}</ul>
}
