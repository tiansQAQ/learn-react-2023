import React from 'react'

/**
 *
 * Lifecycle of Reactive Effects
 * effect 的生命周期
 *
 */

// Effect的生命周期与组件不同。组件可以装载、更新或卸载。Effect只能做两件事：开始同步某些内容，然后停止同步它。
// 如果你的Effect取决于随时间变化的props和status，这个循环可能会发生多次。
// React 提供了一个 linter 规则来检查你是否正确指定了Effect的依赖项。这样可以使您的Effect与最新的props和status保持同步。

// Effect的生命周期

// 每个 React 组件都经历相同的生命周期：
// 1. 组件在添加到屏幕时装载。
// 2. 组件在收到新的props或status时会更新，通常是为了响应交互。
// 3. 组件从屏幕中删除时会卸载。

// 这是考虑组件的好方法，但不是考虑Effect的好方法。相反，请尝试独立于组件的生命周期来考虑每个Effect。
// Effect描述了如何将外部系统同步到当前 props 和 status。随着代码的更改，同步需要或多或少地发生。

// 为了说明这一点，请考虑将组件连接到聊天服务器的以下Effect：
const serverUrl = 'https://localhost:1234'

function ChatRoom({ roomId }) {
  useEffect(() => {
    //  useEffect正文指定如何开始同步：
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    //useEffect返回的清理函数指定如何停止同步：
    return () => {
      connection.disconnect()
    }
  }, [roomId])
  // ...
}

// 直观地说，您可能会认为 React 会在组件挂载时开始同步，并在组件卸载时停止同步。然而，这还不是故事的结局！有时，可能还需要在组件保持挂载状态时多次启动和停止同步。
// 让我们看看为什么这是必要的，何时发生，以及如何控制这种行为。
// 某些Effect根本不返回清理函数。通常情况下，你会想要返回一个——但如果你不这样做，React 的行为就像你返回了一个空的清理函数一样。

/**
 * Why synchronization may need to happen more than once 为什么可能需要多次进行同步
 */

// 假设这个 ChatRoom 组件接收用户在下拉列表中选择的 roomId prop。假设最初用户选择 "general" 个房间作为 roomId 。您的应用显示 "general" 聊天室：
const serverUrl1 = 'https://localhost:1234'

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>
}

// 显示 UI 后，React 将运行你的Effect开始同步。它连接到 "general" 房间：

function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId) // Connects to the "general" room
    connection.connect()
    return () => {
      connection.disconnect() // Disconnects from the "general" room
    }
  }, [roomId])
  // ...
  return <h1>Welcome to the {roomId} room!</h1>
}

// 稍后，用户在下拉列表中选择其他房间（例如 "travel" ）。首先，React 将更新 UI：
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>
}

// 用户看到 "travel" 是 UI 中选定的聊天室。但是，上次运行的效果仍连接到 "general" 个房间。
// roomId prop 已更改，因此您的Effect当时所做的（连接到 "general" 个房间）不再与 UI 匹配。

// 此时，您希望 React 做两件事：

// 1. 停止与旧 roomId 同步（断开与 "general" 房间的连接）
// 2. 开始与新的 roomId 同步（连接到 "travel" 房间）

// 幸运的是，你已经教会了 React 如何做这两件事！效果的正文指定如何开始同步，清理函数指定如何停止同步。
// React 现在需要做的就是以正确的顺序、正确的 props 和状态调用它们。让我们看看这究竟是如何发生的。

// React 如何重新同步你的effect

// 回想一下，您的 ChatRoom 组件已为其 roomId 道具收到一个新值。以前是 "general" ，现在是 "travel" 。React 需要重新同步你的效果，将你重新连接到另一个房间。

// 要停止同步，React 将调用您的 Effect 在连接到 "general" 房间后返回的清理函数。由于 roomId 是 "general" ，清理功能与 "general" 房间断开连接：
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId) // Connects to the "general" room
    connection.connect()
    return () => {
      connection.disconnect() // Disconnects from the "general" room
    }
    // ...
  })
}

// 然后 React 将运行你在此渲染期间提供的effect。这一次， roomId 是 "travel" ，因此它将开始同步到 "travel" 聊天室（直到最终也调用其清理函数）

function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId) // Connects to the "travel" room
    connection.connect()
    // ...
  })
}

// 因此，您现在可以连接到用户在 UI 中选择的同一房间。避免了灾难！

// 每次组件使用不同的 roomId 重新渲染后，效果都会重新同步。
// 例如，假设用户将 roomId 从 "travel" 更改为 "music" 。
// React 将通过调用其清理函数（断开您与 "travel" 个房间的连接）再次停止同步您的effect。
// 然后它将通过运行其身体与新的 roomId props（将您连接到 "music" 房间）再次开始同步。

// 最后，当用户转到其他屏幕时， ChatRoom 卸载。现在完全不需要保持连接。React 将最后一次停止同步您的effect，并断开您与 "music" 个聊天室的连接。

// Thinking from the Effect’s perspective 从effect的角度思考

// 1. ChatRoom mounted with roomId set to "general" ChatRoom 安装， roomId 设置为 "general"
//
// 2. ChatRoom updated with roomId set to "travel"  ChatRoom 更新为 roomId 设置为 "travel"
//
// 3. ChatRoom updated with roomId set to "music"  ChatRoom 更新为 roomId 设置为 "music"
//
// 4. ChatRoom unmounted  ChatRoom 未挂载

// 在组件生命周期中的每个点中，effect都执行了不同的操作：

// 1. 您的effect与 "general" 房间相连
// 2. 您的effect与 "general" 房间断开连接并连接到 "travel" 房间
// 3. 您的effect与 "travel" 房间断开连接并连接到 "music" 房间
// 4. 您的effect与 "music" 房间断开连接

// 现在让我们从effect本身的角度考虑发生了什么：
useEffect(() => {
  // 您的 Effect 连接到使用 roomId 指定的房间
  const connection = createConnection(serverUrl, roomId)
  connection.connect()
  return () => {
    // 直到断开连接
    connection.disconnect()
  }
}, [roomId])

// 此代码的结构可能会激发您查看作为一系列不重叠时间段发生的事情：

// 您的effect已连接到 "general" 房间（直到它断开连接）
// 您的effect已连接到 "travel" 房间（直到它断开连接）
// 您的effect已连接到 "music" 房间（直到它断开连接）

// 以前，您是从组件的角度思考的。从组件的角度来看，很容易将 Effects 视为在特定时间触发的“回调”或“生命周期事件”，例如“渲染后”或“卸载之前”。这种思维方式很快就会变得复杂，所以最好避免。

// 相反，始终一次专注于一个启动/停止循环。组件是装载、更新还是卸载无关紧要
// 您需要做的就是描述如何启动同步以及如何停止同步。如果你做得好，你的effect将能够根据需要多次启动和停止。

// 这可能会提醒您在编写创建 JSX 的呈现逻辑时如何不考虑组件是正在挂载还是更新。你描述屏幕上应该显示的内容，React 会弄清楚其余的内容。

import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl2 = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl2, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}

// 请注意，当组件首次装载时，您会看到三个日志：


// 1. ✅ Connecting to "general" room at https://localhost:1234... （仅限开发）
// 2. ❌ Disconnected from "general" room at https://localhost:1234. （仅限开发）
// 3. ✅ Connecting to "general" room at https://localhost:1234...

// 前两个日志仅供开发使用。在开发中，React 总是重新挂载每个组件一次。


// React 通过强制effect在开发中立即执行此操作来验证您的效果是否可以重新同步。这可能会提醒您打开门并额外关闭它以检查门锁是否有效。React 在开发中额外启动和停止您的effect一次，以检查您是否很好地实现了它的清理。

// effect在实践中重新同步的主要原因是它使用的某些数据是否已更改。在上面的沙盒中，更改所选的聊天室。请注意，当 roomId 更改时，effect会重新同步。

// 但是，在更不寻常的情况下，需要重新同步。例如，尝试在聊天打开时编辑上述沙盒中的 serverUrl 。请注意effect如何重新同步以响应您对代码的编辑。将来，React 可能会添加更多依赖于重新同步的功能。

// How React knows that it needs to re-synchronize the Effect React 如何知道它需要重新同步effect

// 你可能想知道 React 是如何知道你的effect需要在 roomId 次更改后重新同步的。这是因为你告诉 React 它的代码依赖于 roomId ，将其包含在依赖项列表中：

function ChatRoom({ roomId }) { // The roomId prop may change over time
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads roomId 
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // So you tell React that this Effect "depends on" roomId
  // ...

}

// 这是如何工作的：
// 你知道 roomId 是一个prop，这意味着它可以随着时间的推移而变化。
// 您知道effect显示为 roomId （因此其逻辑取决于以后可能会更改的值）。
// 这就是您将其指定为 Effect 依赖项的原因（以便在 roomId 更改时重新同步）。

// 每次组件重新渲染后，React 都会查看你传递的依赖项数组。如果数组中的任何值与您在上次渲染期间传递的同一位置的值不同，React 将重新同步您的effect。

// 例如，如果您在初始渲染期间传递了 ["general"] ，后来在下一次渲染中传递了 ["travel"] ，则 React 将比较 "general" 和 "travel" 。
// 这些是不同的值（与 Object.is 相比），因此 React 将重新同步您的effect。另一方面，如果您的组件重新渲染但 roomId 没有更改，您的effect将保持连接到同一个房间。

// Each Effect represents a separate synchronization process 每个effect 代表一个单独的同步过程

// 不要向effect添加不相关的逻辑，因为此逻辑需要与您已经编写的effect同时运行。例如，假设您希望在用户访问聊天室时发送分析事件。您已经有一个依赖于 roomId 的effect，因此您可能很想在那里添加分析调用：
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}

// 但假设您稍后向此effect添加了另一个依赖项，需要重新建立连接。如果此effect重新同步，它还将为同一房间调用 logVisit(roomId) ，这是您不希望的。记录访问是与连接不同的过程。将它们编写为两个单独的效果：

function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}

// 代码中的每个effect都应表示一个单独且独立的同步过程。

// 在上面的示例中，删除一个effect不会破坏另一个effect的逻辑。这是一个很好的迹象，表明它们同步了不同的东西，因此将它们分开是有意义的。
// 另一方面，如果将一个有凝聚力的逻辑拆分为单独的 Effects，代码可能看起来“更干净”，但更难维护。这就是为什么你应该考虑进程是相同还是分开，而不是代码看起来是否干净。


// Effects “react” to reactive values 

// effect读取两个变量（ serverUrl 和 roomId ），但您只指定了 roomId 作为依赖项：

const serverUrl3 = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl3, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}


// 为什么 serverUrl3 不需要是依赖项？

// 这是因为 serverUrl3 永远不会因重新渲染而更改。无论组件重新渲染多少次以及为什么，它始终是相同的。
// 由于 serverUrl3 永远不会更改，因此将其指定为依赖项是没有意义的。毕竟，依赖项只有在随时间变化时才起作用！

// 另一方面， roomId 在重新渲染时可能不同。在组件中声明的 props、state 和其他值是响应式的，因为它们是在渲染期间计算并参与 React 数据流的。

// 如果 serverUrl3 是状态变量，它将是响应式的。反应值必须包含在依赖项中：

function ChatRoom({ roomId }) { // Props change over time
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State may change over time

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads props and state
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So you tell React that this Effect "depends on" on props and state
  // ...
}

// 通过将 serverUrl 作为依赖项包含在内，可以确保effect在更改后重新同步。

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}


import { useState, useEffect } from 'react';


function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}

// 每当更改响应zhi4（如 0 或 serverUrl ）时，effect都会重新连接到聊天服务器。


// 具有空依赖项的effect意味着什么

// 如果将 serverUrl 和 roomId 都移到组件之外，会发生什么情况？

const serverUrl4 = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl4, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}

// 现在，effect的代码不使用任何反应值，因此其依赖项可以为空 （ [] ）。

// 从组件的角度来看，空的 [] 依赖数组意味着此 Effect 仅在组件装载时连接到聊天室，仅在组件卸载时断开连接。（请记住，React 仍然会在开发中重新同步它，以对您的逻辑进行压力测试）。

import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl5 = 'https://localhost:1234';
const myRoomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl5, myRoomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {myRoomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
// 但是，如果您从effect的角度考虑，则根本不需要考虑安装和卸载。重要的是，您已经指定了effect用于启动和停止同步的功能。今天，它没有响应式依赖。
// 但是，如果您希望用户随着时间的推移更改 roomId 或 serverUrl （并且它们将成为反应性），则effect的代码不会更改。您只需将它们添加到依赖项中。



// All variables declared in the component body are reactive  组件主体中声明的所有变量都是响应式的


// prop和state并不是唯一的反应值。从它们计算的值也是反应性的。
// 如果 props 或state发生变化，您的组件将重新渲染，并且从它们计算的值也会发生变化。
// 这就是为什么effect使用的组件主体中的所有变量都应位于effect依赖项列表中的原因。

// 假设用户可以在下拉列表中选择聊天服务器，但他们也可以在设置中配置默认服务器。
// 假设你已将设置状态放在上下文中，以便从该上下文中读取 settings 。现在，您根据 props 和默认服务器中选择的服务器计算 serverUrl ：

function ChatRoom({ roomId, selectedServerUrl }) { // roomId is reactive
  const settings = useContext(SettingsContext); // settings is reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Your Effect reads roomId and serverUrl
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // So it needs to re-synchronize when either of them changes!
  // ...
}
// 在此示例中， serverUrl 不是 prop 或 state。它是您在渲染期间计算的常规变量。但它是在渲染期间计算的，因此它可能会因重新渲染而更改。这就是为什么它是被动的。

// 组件中的所有值（包括组件主体中的 props、state 和变量）都是响应式的。任何响应式值都可以在重新渲染时更改，因此您需要将响应式值作为 Effect 的依赖项包含在内。



// 全局值或可变值可以是依赖项吗？

// 可变值（包括全局变量）不是被动的。像 location.pathname 这样的可变值不能是依赖项。它是可变的，因此可以随时完全在 React 渲染数据流之外进行更改。更改它不会触发组件的重新渲染。因此，即使您在依赖项中指定了它，React 也不知道在效果更改时重新同步效果。这也违反了 React 的规则，因为在渲染期间（也就是计算依赖关系时）读取可变数据会破坏渲染的纯度。相反，您应该读取并订阅具有 useSyncExternalStore 的外部可变值。
// 像 ref.current 这样的可变值或您从中读取的内容也不能是依赖项。 useRef 本身返回的 ref 对象可以是依赖项，但其 current 属性是有意可变的。它使您可以跟踪某些内容，而无需触发重新渲染。但是由于更改它不会触发重新渲染，因此它不是一个反应值，并且 React 不会知道在它发生变化时重新运行你的 Effect。

// React verifies that you specified every reactive value as a dependency React 验证您是否将每个反应值指定为依赖项


// 如果您的 linter 配置为 React，它将检查您的 Effect 代码使用的每个反应值是否都声明为其依赖项。例如，这是一个 lint 错误，因为 roomId 和 serverUrl 都是反应性的：

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}


import { useState, useEffect } from 'react';


function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}

// 这可能看起来像一个 React 错误，但实际上 React 指出了你代码中的一个错误。 roomId 和 serverUrl 都可能随时间而变化，但您忘记在它们发生变化时重新同步效果。即使用户在 UI 中选择不同的值，您仍将保持与初始 roomId 和 serverUrl 的连接。

// 要修复该错误，请按照 linter 的建议指定 roomId 和 serverUrl 作为效果的依赖项：

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
//  在某些情况下，React 知道一个值永远不会改变，即使它是在组件中声明的。例如，从 useState 返回的 set 函数和由 useRef 返回的 ref 对象是稳定的 — 它们保证在重新渲染时不会更改。
// 稳定值不是反应性的，因此您可以从列表中省略它们。允许包括它们：它们不会改变，所以没关系。


// What to do when you don’t want to re-synchronize 不想重新同步时该怎么办

// 在前面的示例中，你已通过将 roomId 和 serverUrl 列为依赖项来修复 lint 错误。

// 但是，您可以向 linter “证明”这些值不是反应值，即它们不会因重新渲染而更改。例如，如果 serverUrl 和 roomId 不依赖于呈现并且始终具有相同的值，则可以将它们移到组件之外。现在它们不需要是依赖项：

const serverUr6 = 'https://localhost:1234'; // serverUrl is not reactive
const roomId2 = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUr6, roomId2);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}

// 您也可以在effect中移动它们。它们不会在渲染期间计算，因此它们不是反应性的：



function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}

// 效果是反应性代码块。当您在其中读取的值发生变化时，它们会重新同步。与每次交互仅运行一次的事件处理程序不同，Effects 在需要同步时运行。

// 不能“选择”依赖项。依赖项必须包含您在effect中读取的每个反应值。linter执行这一点。有时这可能会导致无限循环等问题，并导致效果重新同步过于频繁。不要通过抑制linter来解决这些问题！以下是要尝试的方法：

// 1. 检查effect是否代表独立的同步过程。如果您的效果没有同步任何内容，则可能是不必要的。如果它同步了几个独立的东西，请将其拆分。
// 2. 如果你想读取 props 或状态的最新值而不对它“反应”并重新同步effect，你可以将effect拆分为反应部分（您将保留在effect中）和非反应部分（您将提取到称为effect事件的东西）。阅读有关将事件与effect分开的信息。
// 3. 避免依赖对象和函数作为依赖项。如果在渲染期间创建对象和函数，然后从effect中读取它们，则它们在每次渲染时都会有所不同。这将导致您的效果每次都重新同步。阅读有关从效果中删除不必要的依赖项的更多信息。


// linter是你的朋友，但它的力量是有限的。linter只知道依赖项何时出错。它不知道解决每个案例的最佳方法。
// 如果 linter 建议依赖关系，但添加它会导致循环，这并不意味着应该忽略 linter。您需要更改 Effect 内部（或外部）的代码，以便该值不是反应性的，也不需要是依赖项。

// 如果您有现有的代码库，则可能会有一些效果来抑制 linter，如下所示：

useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);


/**
 * 总结： 
 * 
 * 组件可以装载、更新和卸载。
 * 每个effect都有一个独立于周围组件的生命周期。
 * 每个effect描述一个可以启动和停止的单独同步过程。
 * 编写和读取 Effects 时，请从每个 Effect 的角度（如何启动和停止同步）而不是从组件的角度（如何装载、更新或卸载）进行思考。
 * 在组件主体内声明的值是“反应性的”。
 * 反应值应重新同步effect，因为它们会随时间而变化。
 * linter 验证effect中使用的所有反应值是否都指定为从属关系。
 * linter 标记的所有错误都是合法的。总有一种方法可以修复代码，以免违反规则。
 * @returns 
 */


export default function LifecycleOfReactiveEffects() {
  return <div>LifecycleOfReactiveEffects</div>
}
