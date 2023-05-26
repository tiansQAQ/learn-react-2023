import React, { useState } from 'react'
import Panel from './Panel.jsx'

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <>
      <Panel title="关于" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        阿拉木图人口约200万，是哈萨克斯坦最大的城市。
      </Panel>
      <Panel title="词源" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        这个名字来自于 <span lang="kk-KZ">алма</span>，
      </Panel>
    </>
  )
}
