import React from 'react'
import Section1 from './Section.jsx'
import Heading from './Heading.jsx'

// 你可以通过以下三个步骤来实现context：

// 1. 创建 一个 context。（你可以将其命名为 LevelContext, 因为它表示的是标题级别。)
// 2. 在需要数据的组件内 使用 刚刚创建的 context。（Heading 将会使用 LevelContext。）
// 3. 在指定数据的组件中 提供 这个 context。 （Section 将会提供 LevelContext。）
// 4. Context 可以让父节点，甚至是很远的父节点都可以为其内部的整个组件树提供数据。

// 这与Page.jsx原始代码的运行结果相同，但是你不需要向每个 Heading 组件传递 level 参数了！取而代之的是，它通过访问上层最近的 Section 来“断定”它的标题级别：

// 1. 你将一个 level 参数传递给 <Section>。
// 2. Section 把它的子元素包在 <LevelContext.Provider value={level}> 里面。
// 3. Heading 使用 useContext(LevelContext) 访问上层最近的 LevelContext 提供的值。

export default function Page1() {
  // 修改一下 JSX，让 Section 组件代替 Heading 组件接收 level 参数：
  return (
    <Section1 level={1}>
      <Heading>主标题</Heading>
      <Section1 level={2}>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Section1 level={3}>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Section1 level={4}>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
          </Section1>
        </Section1>
      </Section1>
    </Section1>
  )
}
