import React from 'react'
import Section from './Section.jsx'
import Heading from './Heading.jsx'
// 通常来说，你会通过 props 将信息从父组件传递到子组件。
// 但是，如果你必须通过许多中间组件向下传递 props，或是在你应用中的许多组件需要相同的信息，传递 props 会变的十分冗长和不便。
// Context 允许父组件向其下层无论多深的任何组件提供信息，而无需通过 props 显式传递。

// 传递 props 带来的问题

// 传递 props 是将数据通过 UI 树显式传递到使用它的组件的好方法。

// 但是当你需要在组件树中深层传递参数以及需要在组件间复用相同的参数时，传递 props 就会变得很麻烦。最近的根节点父组件可能离需要数据的组件很远，状态提升 到太高的层级会导致 “逐层传递 props” 的情况。

// 要是有一种方法可以在组件树中不需要 props 将数据“直达”到所需的组件中，那可就太好了。React 的 context 功能可以满足我们的这个心愿。

// Context：传递 props 的另一种方法

// Context 让父组件可以为它下面的整个组件树提供数据。Context 有很多种用途。
// 假设你想让相同 Section 中的多个 Heading 具有相同的尺寸
// 目前，你将 level 参数分别传递给每个 <Heading>：
// 将 level 参数传递给 <Section> 组件而不是传给 <Heading> 组件看起来更好一些。这样的话你可以强制使同一个 section 中的所有标题都有相同的尺寸：
// 但是 <Heading> 组件是如何知道离它最近的 <Section> 的 level 的呢？这需要子组件可以通过某种方式“访问”到组件树中某处在其上层的数据。
// 你不能只通过 props 来实现它。这就是 context 大显身手的地方: Page1.jsx
export default function Page() {
  return (
    <Section>
      <Heading level={1}>主标题</Heading>
      <Section>
        <Heading level={2}>副标题</Heading>
        <Heading level={2}>副标题</Heading>
        <Heading level={2}>副标题</Heading>
        <Section>
          <Heading level={3}>子标题</Heading>
          <Heading level={3}>子标题</Heading>
          <Heading level={3}>子标题</Heading>
          <Section>
            <Heading level={4}>子子标题</Heading>
            <Heading level={4}>子子标题</Heading>
            <Heading level={4}>子子标题</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  )
}
