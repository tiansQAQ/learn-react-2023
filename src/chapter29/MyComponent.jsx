import React from 'react'

/**
 * 可能不需要effect
 */

// 效果是 React 范式的逃生舱口。它们允许您“走出”React，并将您的组件与一些外部系统（如非React小部件，网络或浏览器DOM）同步。
// 如果没有涉及外部系统（例如，如果要在某些 props 或状态更改时更新组件的状态），则不需要 Effect。
// 删除不必要的Effect将使代码更易于遵循、运行速度更快且不易出错。

// 如何删除不必要的Effect

// 在两种常见情况下，您不需要效果：

// 1. 您不需要效果来转换数据以进行渲染。例如，假设您要在显示列表之前对其进行筛选。您可能会想编写一个 Effect，以便在列表更改时更新状态变量。
// 但是，这是低效的。当你更新状态时，React 将首先调用你的组件函数来计算屏幕上应该显示的内容。
// 然后 React 会将这些更改“提交”到 DOM 中，更新屏幕。
// 然后 React 将运行你的效果。如果您的Effect也立即更新状态，则会从头开始重新启动整个过程！为避免不必要的渲染通道，请在组件的顶层转换所有数据。
// 每当你的props或status发生变化时，该代码就会自动重新运行。

// 2. 您不需要效果来处理用户事件。例如，假设您要发送 /api/buy POST 请求并在用户购买产品时显示通知。
// 在“购买”按钮单击事件处理程序中，您确切地知道发生了什么。
// 当Effect运行时，您不知道用户做了什么（例如，单击了哪个按钮）。
// 这就是您通常会在相应的事件处理程序中处理用户事件的原因。

// 您确实需要效果才能与外部系统同步。例如，你可以编写一个Effect，使 jQuery 小部件与 React 状态保持同步。您还可以使用 Effects 获取数据：例如，您可以将搜索结果与当前搜索查询同步。请记住，与直接在组件中编写 Effects 相比，现代框架提供了更有效的内置数据获取机制。

// 根据props或status更新status

// 假设您有一个包含两个状态变量的组件： firstName 和 lastName 。您想通过连接它们来计算它们的 fullName 。
// 此外，您希望 fullName 在 firstName 或 lastName 发生变化时更新。
// 您的第一直觉可能是添加一个 fullName 状态变量并在Effect中更新它：
// function Form() {
//   const [firstName, setFirstName] = useState('Taylor')
//   const [lastName, setLastName] = useState('Swift')

//   // 🔴 Avoid: redundant state and unnecessary Effect
//   const [fullName, setFullName] = useState('')
//   useEffect(() => {
//     setFullName(firstName + ' ' + lastName)
//   }, [firstName, lastName])
//   // ...
// }

// 这比必要的更复杂。它的效率也很低：它使用过时值 fullName 执行整个渲染通道，然后立即使用更新的值重新渲染。删除status和effect：
function Form() {
  const [firstName, setFirstName] = useState('Taylor')
  const [lastName, setLastName] = useState('Swift')
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName
  // ...
}

// 当可以从现有的props或status计算出某些东西时，不要把它放在status中。相反，请在渲染期间计算它。这使您的代码更快（避免额外的“级联”更新）。

// 该组件通过获取 props 收到的 todos 并根据 filter prop 过滤它们来计算 visibleTodos 。您可能很想将结果存储在status中并从useEffect中更新它：

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('')
  // 🔴 避免：冗余状态和不必要的效果
  const [visibleTodos, setVisibleTodos] = useState([])
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter))
  }, [todos, filter])

  // ...
}

// 与前面的示例一样，这既不必要又效率低下。首先，删除status和useEffect：

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('')
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter)
  // ...
}
// 通常，此代码很好！但也许 getFilteredTodos() 很慢，或者你有很多 todos 。
// 在这种情况下，如果某些不相关的状态变量（如 newTodo ）已更改，则您不想重新计算 getFilteredTodos()。

// 您可以通过将昂贵的计算包装在 useMemo Hook 中来缓存（或“记忆”）它：
import { useMemo, useState } from 'react'

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('')
  const visibleTodos = useMemo(() => {
    // ✅ 除非待办事项或过滤器更改，否则不会重新运行
    return getFilteredTodos(todos, filter)
  }, [todos, filter])
  // ...
}

// 或者，写成一行：

import { useMemo, useState } from 'react'

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('')
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter])
  // ...
}
// 这告诉 React 你不希望内部函数重新运行，除非 todos 或 filter 发生了变化。
// React 会在初始渲染期间记住返回值 getFilteredTodos() 。在下一次渲染期间，它将检查 todos 或 filter 是否不同。
// 如果它们与上次相同，则 useMemo 将返回它存储的最后一个结果。但如果它们不同，React 将再次调用内部函数（并存储其结果）。

// 包装为 useMemo 的函数在渲染期间运行，因此这仅适用于纯计算。

// useMemo 不会让第一次渲染更快。它只会帮助您跳过不必要的更新工作。



export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');
  
  // 🔴 Avoid: Resetting state on prop change in an Effect
  // 避免重置 Effect 中props更改的状态 
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
// 这是低效的，因为 ProfilePage 及其子项将首先使用过时值呈现，然后再次呈现。这也很复杂，因为您需要在 ProfilePage 中具有某种状态的每个组件中执行此操作。例如，如果注释 UI 是嵌套的，则还需要清除嵌套的注释状态。

// 相反，你可以告诉 React 每个用户的配置文件在概念上都是不同的配置文件，方法是给它一个明确的键。将组件一分为二，并将 key 属性从外部组件传递到内部组件：

export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}

// 通常，React 会保留在同一位置渲染相同组件时的状态。
// 通过将 userId 作为 key 传递给 Profile 组件，您要求 React 将两个具有不同 userId 的 Profile 组件视为两个不应共享任何状态的不同组件。
//  每当键（你设置为 userId ）发生变化时，React 都会重新创建 DOM 并重置 Profile 组件及其所有子组件的状态。现在，在配置文件之间导航时，评论字段将自动清除

// 请注意，在此示例中，仅导出外部 ProfilePage 组件，并且对项目中的其他文件可见。
// 渲染 ProfilePage 的组件不需要将key传递给它：它们将 userId 作为常规props传递。事实上， ProfilePage 将其作为 key 传递给内部 Profile 组件是一个实现细节。


// 在props更改时调整某些状态

// 有时，您可能希望重置或调整props更改时的一部分状态，但不是全部。


// 此 List 组件接收 items 的列表作为props，并在 selection 状态变量中维护所选项目。您希望在 items prop 收到不同的数组时将 selection 重置为 null ：
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  // 避免重置 Effect中props更改的状态 
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}

// 这也并不理想。每次 items 更改时， List 及其子组件将首先呈现过时的 selection 值。然后 React 将更新 DOM 并运行 Effects。最后， setSelection(null) 调用将导致 List 及其子组件再次重新渲染，再次重新启动整个过程。

// 首先删除effect。相反，请在渲染期间直接调整状态：

function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}

// 像这样存储以前渲染中的信息可能很难理解，但这比在effect中更新相同的状态要好。在上面的示例中，在渲染期间直接调用 setSelection 。React 将在退出 List 后立即以 return 语句重新渲染。
// React 尚未渲染 List 个子项或更新 DOM，因此这让 List 个子项跳过渲染过时的 selection 值。


// 当你在渲染过程中更新组件时，React 会丢弃返回的 JSX 并立即重试渲染。
// 为了避免非常缓慢的级联重试，React 只允许你在渲染期间更新同一组件的状态。
// 如果在渲染期间更新其他组件的状态，则会看到错误。
// 像 items !== prevItems 这样的条件是避免循环所必需的。
// 您可以像这样调整状态，但任何其他effect（如更改 DOM 或设置超时）都应保留在事件处理程序或 Effects 中，以保持组件纯正。

// 尽管此模式比effect更有效，但大多数组件也不需要它。不管怎么做，根据 props 或其他状态调整状态会使数据流更难理解和调试。始终检查是否可以使用键重置所有状态或在渲染期间计算所有内容。
// 例如，您可以存储所选项目 ID，而不是存储（和重置）所选项目：

function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}

// 现在根本不需要“调整”state。如果具有选定 ID 的项目在列表中，它将保持选中状态。
// 如果不是，则在呈现期间计算的 selection 将为 null ，因为未找到匹配项。
// 此行为是不同的，但可以说更好，因为对 items 的大多数更改都会保留选择。

// 在事件处理程序之间共享逻辑

// 假设您有一个产品页面，其中包含两个按钮（购买和结帐），这两个按钮都允许您购买该产品。
// 您希望在用户将产品放入购物车时显示通知。在两个按钮的单击处理程序中调用 showNotification() 感觉重复，因此您可能想将此逻辑放在 Effect 中：
function ProductPage({ product, addToCart }) {

  // 🔴 Avoid: Event-specific logic inside an Effect
  // 避免Effect中特定于事件的逻辑

  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}

// 此effect是不必要的。它也很可能会导致错误。例如，假设您的应用在页面重新加载之间“记住”购物车。
// 如果您将产品添加到购物车一次并刷新页面，通知将再次出现。每次您刷新该产品页面时，它都会继续出现。
// 这是因为 product.isInCart 在页面加载时已经是 true ，所以上面的effect将调用 showNotification() 。


 // 如果不确定某些代码应位于 Effect 中还是位于事件处理程序中，请问问自己为什么需要运行此代码。
 // 仅对由于向用户显示组件而应运行的代码使用 Effects。在此示例中，通知的出现应该是因为用户按下了按钮，而不是因为显示了页面！
 // 删除 Effect 并将共享逻辑放入从两个事件处理程序调用的函数中：

 function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}

// 发送post请求

// 此 Form 组件发送两种类型的 POST 请求。它在装载时发送分析事件。
// 当您填写表单并单击“提交”按钮时，它将向 /api/register 个端点发送 POST 请求：
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}


// 分析 POST 请求应保留在effect中。这是因为发送分析事件的原因是表单已显示。

// 但是， /api/register POST 请求不是由正在显示的表单引起的。您只想在某个特定时刻发送请求：当用户按下按钮时。它应该只发生在那个特定的交互上。删除第二个effect并将该 POST 请求移动到事件处理程序中：

function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}

// 当您选择是将某些逻辑放入事件处理程序还是 Effect 中时，您需要回答的主要问题是，从用户的角度来看，它是哪种逻辑。
// 如果此逻辑是由特定交互引起的，请将其保留在事件处理程序中。如果它是由用户在屏幕上看到组件引起的，请将其保留在effect中

// Chains of computations  计算链

// 有时，您可能会想链接效果，每个效果都根据其他状态调整一段状态：
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  // 避免：单独调整状态以相互触发的效果链
  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }
  // ...

}

// 此代码有两个问题。

// 一个问题是它的效率非常低：组件（及其子组件）必须在链中的每个 set 调用之间重新渲染。在上面的示例中，在最坏的情况下（ setCard →渲染→ setGoldCardCount →渲染→ setRound →渲染→ setIsGameOver →渲染），下面有三个不必要的树重新渲染。

// 即使它不慢，随着代码的发展，你也会遇到你编写的“链”不符合新要求的情况。假设您正在添加一种方法来逐步浏览游戏移动的历史记录。您可以通过将每个状态变量更新为过去的值来做到这一点。但是，将 card 状态设置为过去的值将再次触发效果链并更改您正在显示的数据。这样的代码通常是僵化和脆弱的。

// 在这种情况下，最好计算渲染期间可以计算的内容，并在事件处理程序中调整状态：

function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...

}
  
// 这要高效得多。此外，如果您实现一种查看游戏历史记录的方法，现在您将能够将每个状态变量设置为过去的移动，而无需触发调整每隔一个值的 Effect 链。如果需要在多个事件处理程序之间重用逻辑，则可以提取函数并从这些处理程序调用它。

// 请记住，在事件处理程序中，状态的行为类似于快照。例如，即使在调用 setRound(round + 1) 之后， round 变量也会反映用户单击按钮时的值。如果需要使用下一个值进行计算，请像 const nextRound = round + 1 一样手动定义它。

// 在某些情况下，无法直接在事件处理程序中计算下一个状态。例如，假设一个具有多个下拉列表的窗体，其中下一个下拉列表的选项取决于上一个下拉列表的选定值。然后，效果链是合适的，因为您正在与网络同步。

// Initializing the application 初始化应用程序

// 某些逻辑应在应用加载时仅运行一次。
// 您可能想将其放置在顶级组件的 Effect 中：

function App() {
  // 🔴 避免: 有只应运行一次的逻辑的effect
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}

// 但是，您很快就会发现它在开发中运行两次。这可能会导致问题，例如，它可能会使身份验证令牌无效，因为函数未设计为调用两次。通常，您的组件应该能够灵活地重新装载。这包括顶级 App 组件。
// 尽管在生产环境中可能永远不会重新挂载代码，但在所有组件中遵循相同的约束可以更轻松地移动和重用代码。
// 如果某些逻辑必须在每次应用加载中运行一次，而不是每次组件装载一次，请添加一个顶级变量来跟踪它是否已执行：

let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}

// 您还可以在模块初始化期间和应用呈现之前运行它：
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  // ✅ Only runs once per app load
 checkAuthToken();
 loadDataFromLocalStorage();
}

function App() {
 // ...
}

// 导入组件时，顶层代码运行一次，即使它最终没有被呈现。为避免在导入任意组件时速度变慢或出现意外行为，请不要过度使用此模式。将应用范围的初始化逻辑保留到根组件模块（如 0）或应用程序的入口点中。

// Notifying parent components about state changes 通知父组件有关state更改的信息


// 假设您正在编写一个内部状态为 isOn 的 Toggle 组件，该状态可以是 true 或 false 。
// 有几种不同的方法可以切换它（通过单击或拖动）。
// 您希望在 Toggle 个内部状态更改时通知父组件，因此公开一个 onChange 事件并从 Effect 调用它：

function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  // onChange 处理程序运行得太晚
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}

// 像之前一样，这并不理想。 Toggle 首先更新其状态，React 更新屏幕。
// 然后 React 运行 Effect，它调用从父组件传递的 onChange 函数。现在，父组件将更新自己的状态，启动另一个渲染通道。最好一次性完成所有操作。

// 删除 Effect，改为更新同一事件处理程序中两个组件的状态：


function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}


// 使用此方法， Toggle 组件及其父组件都会在事件期间更新其状态。React 将来自不同组件的更新批处理在一起，因此只有一个渲染通道。
// 您还可以完全删除状态，而是从父组件接收 isOn ：
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
// “提升状态”允许父组件通过切换父组件自己的状态来完全控制 Toggle 。这意味着父组件必须包含更多逻辑，但总体上需要担心的状态会更少。
// 每当您尝试保持两个不同的状态变量同步时，请尝试提升状态！

// Passing data to the parent 将数据传递给父级

// 此 Child 组件获取一些数据，然后将其传递给effect中的 Parent 组件：

function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}

// 在 React 中，数据从父组件流向它们的子组件。当你在屏幕上看到错误时，你可以通过沿着组件链向上追溯信息的来源，直到你找到哪个组件传递了错误的道具或具有错误的状态。
// 当子组件在effect中更新其父组件的状态时，数据流变得非常难以跟踪。由于子组件和父组件都需要相同的数据，因此让父组件获取该数据，并将其传递给子组件：
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}

//  这更简单，并使数据流保持可预测性：数据从父级向向子级。

// Subscribing to an external store 订阅外部store

// 有时，您的组件可能需要订阅 React 状态之外的某些数据。此数据可能来自第三方库或内置浏览器 API。由于这些数据可以在 React 不知情的情况下更改，因此您需要手动为您的组件订阅它。这通常通过effect来完成，例如：

function useOnlineStatus() {
  // 不理想：Effect 中的手动store订阅
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}

// 在这里，组件订阅外部数据存储（在本例中为浏览器 navigator.onLine API）。
// 由于服务器上不存在此 API（因此不能用于初始 HTML），因此最初状态设置为 true 。每当该数据存储的值在浏览器中发生更改时，组件都会更新其状态。

// 虽然通常为此使用 Effects，但 React 有一个专门构建的 Hook，用于订阅首选的外部存储。删除effect并将其替换为对 useSyncExternalStore 的调用：

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  // 使用内置 Hook 订阅外部store
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function 只要你传递相同的函数，React 就不会重新订阅
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}

// 这种方法比手动将可变数据同步到 React 状态和effect更不容易出错。
// 通常，您将编写一个自定义 Hook，如上面的 useOnlineStatus() ，这样你就不需要在各个组件中重复此代码。阅读更多关于从 React 组件订阅外部存储的信息。

// Fetching data  获取数据

// 许多应用使用effect来启动数据获取。像这样编写数据获取effect是很常见的：

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    // 避免：在没有清理逻辑的情况下获取
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

// 无需将此提取移动到事件处理程序。

// 这似乎与前面的示例相矛盾，在这些示例中，您需要将逻辑放入事件处理程序中！
// 但是，请注意，键入事件不是获取的主要原因。搜索输入通常是从 URL 预填充的，用户可能会在不触摸输入的情况下导航“后退”和“前进”。


// page 和 query 来自哪里并不重要。当此组件可见时，您希望使 results 与当前 page 和 query 的网络数据保持同步。这就是为什么它是一种effect

// 但是，上面的代码有一个错误。假设您快速键入 "hello" 。
// 然后 query 将从 "h" 变为 "he" 、 "hel" 、 "hell" 和 "hello" 。
// 这将启动单独的获取，但无法保证响应将以哪个顺序到达。
// 例如， "hell" 响应可能在 "hello" 响应之后到达。由于它将最后调用 setResults() ，因此您将显示错误的搜索结果。
// 这称为“争用条件”：两个不同的请求相互“争用”，并且顺序与您预期的不同。

// 若要修复争用条件，需要添加一个清理函数以忽略过时的响应：


function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

// 这可确保在效果获取数据时，将忽略除上次请求的响应之外的所有响应。

// 处理争用条件并不是实现数据获取的唯一困难。您可能还需要考虑缓存响应（以便用户可以单击“后退”并立即查看上一个屏幕），
// 如何在服务器上获取数据（以便初始服务器呈现的 HTML 包含提取的内容而不是微调器），以及如何避免网络瀑布（以便子级可以获取数据而无需等待每个父级）。

// 这些问题适用于任何 UI 库，而不仅仅是 React。解决它们并非易事，这就是为什么现代框架提供的内置数据获取机制比在 Effects 中获取数据更有效的原因。

// 如果您不使用框架（并且不想构建自己的框架），但希望使从 Effects 获取数据更符合人体工程学，请考虑将获取逻辑提取到自定义 Hook 中，如以下示例所示

function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}

// 您可能还需要添加一些用于错误处理的逻辑，并跟踪内容是否正在加载。
// 你可以自己构建一个这样的 Hook，也可以使用 React 生态系统中已经可用的众多解决方案之一。
// 虽然仅此一项不会像使用框架的内置数据获取机制那样有效，
// 但将数据获取逻辑移动到自定义 Hook 中将使以后更容易采用高效的数据获取策略。

// 通常，每当您必须求助于编写 Effects 时，请留意何时可以使用更具声明性和专门构建的 API 将一段功能提取到自定义 Hook 中，如上面的 useData 。组件中的原始 useEffect 调用越少，就越容易维护应用程序。




// 1. 如果您可以在渲染过程中计算某些内容，则不需要useEffect。
// 2. 若要缓存昂贵的计算，请添加 useMemo 而不是 useEffect 。
// 3. 要重置整个组件树的状态，请向其传递不同的 key 。
// 4. 要重置特定位以响应props更改，请在渲染期间设置它。
// 5. 由于显示组件而运行的代码应位于useEffect中，其余代码应位于事件中。
// 6. 如果需要更新多个组件的状态，最好在单个事件期间执行此操作。
// 7. 每当尝试同步不同组件中的state变量时，请考虑提升state。
// 8. 您可以使用 Effects 获取数据，但需要实现清理以避免争用条件。
export default function MyComponent() {
  return <div>MyComponent</div>
}
