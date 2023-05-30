import React from 'react'
import Section2 from './Section1.jsx'
import Heading from './Heading.jsx'

// 目前，你仍需要手动指定每个 section 的 level：
// export default function Page() {
//     return (
//       <Section level={1}>
//         ...
//         <Section level={2}>
//           ...
//           <Section level={3}>

// 由于 context 让你可以从上层的组件读取信息，每个 Section 都会从上层的 Section 读取 level，并自动向下层传递 level + 1。
// 你可以像下面这样做：

// export default function Section({ children }) {
//     const level = useContext(LevelContext);
//     return (
//       <section className="section">
//         <LevelContext.Provider value={level + 1}>
//           {children}
//         </LevelContext.Provider>
//       </section>
//     );
//   }

// 这样修改之后，你不用将 level 参数传给 <Section> 或者是 <Heading> 了：
// 现在，Heading 和 Section 都通过读取 LevelContext 来判断它们的深度。
// 而且 Section 把它的子组件都包在 LevelContext 中来指定其中的任何内容都处于一个“更深”的级别。

// 本示例使用标题级别来展示，因为它们直观地显示了嵌套组件如何覆盖 context。
// 但是 context 对于许多其他的场景也很有用。你可以用它来传递整个子树需要的任何信息：当前的颜色主题、当前登录的用户等。
export default function Page1() {
  return (
    <Section2>
      <Heading>主标题</Heading>
      <Section2>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Heading>副标题</Heading>
        <Section2>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Heading>子标题</Heading>
          <Section2>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
            <Heading>子子标题</Heading>
          </Section2>
        </Section2>
      </Section2>
    </Section2>
  )
}
