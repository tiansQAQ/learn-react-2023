import React from 'react'

import Heading from './Heading.jsx'
import Section from './Section.jsx'

// Context 会穿过中间层级的组件

// 你可以在提供 context 的组件和使用它的组件之间的层级插入任意数量的组件。
// 这包括像 <div> 这样的内置组件和你自己创建的组件。

// 在这个示例中，相同的 Post 组件（带有虚线边框）在两个不同的嵌套层级上渲染。注意，它内部的 <Heading> 会自动从最近的 <Section> 获取它的级别：

// 你不需要做任何特殊的操作。Section 为它内部的树指定一个 context，所以你可以在任何地方插入一个 <Heading>，而且它会有正确的尺寸。

// Context 让你可以编写“适应周围环境”的组件，并且根据 在哪 （或者说 在哪个 context 中）来渲染它们不同的样子。

// 使用 Context 看起来非常诱人！然而，这也意味着它也太容易被过度使用了。如果你只想把一些 props 传递到多个层级中，这并不意味着你需要把这些信息放到 context 里。

// 在使用 context 之前，你可以考虑以下几种替代方案：

// 1. 从 传递 props 开始。 如果你的组件看起来不起眼，那么通过十几个组件向下传递一堆 props 并不罕见。这有点像是在埋头苦干，但是这样做可以让哪些组件用了哪些数据变得十分清晰！维护你代码的人会很高兴你用 props 让数据流变得更加清晰。

// 2. 抽象组件并将 JSX 作为 children 传递 给它们。 如果你通过很多层不使用该数据的中间组件（并且只会向下传递）来传递数据，这通常意味着你在此过程中忘记了抽象组件。举个例子，你可能想传递一些像 posts 的数据 props 到不会直接使用这个参数的组件，类似 <Layout posts={posts} />。取而代之的是，让 Layout 把 children 当做一个参数，然后渲染 <Layout><Posts posts={posts} /></Layout>。这样就减少了定义数据的组件和使用数据的组件之间的层级。如果这两种方法都不适合你，再考虑使用 context。

// 如果这两种方法都不适合你，再考虑使用 context。

// Context 的使用场景
// 1. 主题： 如果你的应用允许用户更改其外观（例如暗夜模式），你可以在应用顶层放一个 context provider，并在需要调整其外观的组件中使用该 context。
// 2. 当前账户： 许多组件可能需要知道当前登录的用户信息。将它放到 context 中可以方便地在树中的任何位置读取它。某些应用还允许你同时操作多个账户（例如，以不同用户的身份发表评论）。在这些情况下，将 UI 的一部分包裹到具有不同账户数据的 provider 中会很方便。
// 3. 路由： 大多数路由解决方案在其内部使用 context 来保存当前路由。这就是每个链接“知道”它是否处于活动状态的方式。如果你创建自己的路由库，你可能也会这么做。
// 4. 状态管理： 随着你的应用的增长，最终在靠近应用顶部的位置可能会有很多 state。许多遥远的下层组件可能想要修改它们。通常 将 reducer 与 context 搭配使用来管理复杂的状态并将其传递给深层的组件来避免过多的麻烦。Context 不局限于静态值。如果你在下一次渲染时传递不同的值，React 将会更新读取它的所有下层组件！这就是 context 经常和 state 结合使用的原因。

// 一般而言，如果树中不同部分的远距离组件需要某些信息，context 将会对你大有帮助。
export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post title="旅行者，你好！" body="来看看我的冒险。" />
      <AllPosts />
    </Section>
  )
}

function AllPosts() {
  return (
    <Section>
      <Heading>帖子</Heading>
      <RecentPosts />
    </Section>
  )
}

function RecentPosts() {
  return (
    <Section>
      <Heading>最近的帖子</Heading>
      <Post title="里斯本的味道" body="...那些蛋挞！" />
      <Post title="探戈节奏中的布宜诺斯艾利斯" body="我爱它！" />
    </Section>
  )
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>{title}</Heading>
      <p>
        <i>{body}</i>
      </p>
    </Section>
  )
}
