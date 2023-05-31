import React, { useRef } from 'react'

// 在这个例子中，itemsRef 保存的不是单个 DOM 节点，而是保存了包含列表项 ID 和 DOM 节点的 Map。(Ref 可以保存任何值！) 每个列表项上的 ref 回调负责更新 Map：
// 这使你可以之后从 Map 读取单个 DOM 节点。

export default function CatFriends1() {
  const itemsRef = useRef(null)

  function scrollToId(itemId) {
    const map = getMap()
    const node = map.get(itemId)
    node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  function getMap() {
    if (!itemsRef.current) {
      // 首次运行时初始化 Map。
      itemsRef.current = new Map()
    }
    return itemsRef.current
  }
  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>Tom</button>
        <button onClick={() => scrollToId(5)}>Maru</button>
        <button onClick={() => scrollToId(9)}>Jellylorum</button>
      </nav>
      <ul style={{ display: 'flex', width: '420px', listStyle: 'none', overflowX: 'auto', padding: '0px' }}>
        {catList.map((cat) => (
          <li
            style={{ padding: '4px' }}
            key={cat.id}
            ref={(node) => {
              const map = getMap()
              node ? map.set(cat.id, node) : map.delete(cat.id)
            }}
          >
            <img src={cat.imageUrl} alt={'Cat #' + cat.id} />
          </li>
        ))}
      </ul>
    </>
  )
}

const catList = []
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  })
}
