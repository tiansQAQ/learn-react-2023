import React from 'react'

export default function SeparatingEventsFromEffects() {
  return <div>SeparatingEventsFromEffects</div>
}

/**
 *
 * 将事件与effect分离
 */

// 事件处理程序仅在再次执行相同的交互时重新运行。与事件处理程序不同，如果 Effects 读取的某些值（如 prop 或 state）与上次渲染期间的值不同，则effect会重新同步。
// 有时，您还需要混合这两种行为：一种重新运行以响应某些值但不响应其他值的effect。本页将教您如何做到这一点。

/**
 * 在事件处理程序和effect之间进行选择
 */

// 首先，让我们回顾一下事件处理程序和effect之间的区别。

// 假设您正在实现一个聊天室组件。您的要求如下所示：

// 1. 您的组件应自动连接到选定的聊天室。

// 2. 当您单击“发送”按钮时，它应该会发送一条消息。

// 假设您已经为它们实现了代码，但不确定将其放在哪里。应该使用事件处理程序还是effect？每次需要回答此问题时，请考虑代码需要运行的原因

/**
 * 为响应特定交互而运行的事件处理程序
 */

// 从用户的角度来看，发送消息应该发生，因为单击了特定的“发送”按钮。如果您在任何其他时间或出于任何其他原因发送他们的消息，用户会感到非常沮丧。这就是为什么发送消息应该是一个事件处理程序。事件处理程序允许您处理特定的交互：
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('')
  // ...
  function handleSendClick() {
    sendMessage(message)
  }
  // ...
  return (
    <>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  )
}

// 使用事件处理程序，可以确定 sendMessage(message) 仅在用户按下按钮时运行。

/**
 * effect在需要同步时运行
 */

// 回想一下，您还需要将组件连接到聊天室。这些代码去哪儿了？
// 运行此代码的原因不是某些特定的交互。用户为什么或如何导航到聊天室屏幕并不重要。
// 现在他们正在查看它并可以与之交互，组件需要与选定的聊天服务器保持连接。
// 即使聊天室组件是应用的初始屏幕，并且用户根本没有执行任何交互，你仍需要连接。这就是为什么它是一个effect。
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId)
    connection.connect()
    return () => {
      connection.disconnect()
    }
  }, [roomId])
  // ...
}

// 使用此代码，您可以确保始终存在与当前所选聊天服务器的活动连接，而不管用户执行的特定交互如何。
// 无论用户仅打开了您的应用、选择了其他房间，还是导航到另一个屏幕并返回，您的 Effect 都会确保组件与当前选定的房间保持同步，并在必要时重新连接。

export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

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
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
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

/**
 * 响应值和响应逻辑
 */

// 直观地说，您可以说事件处理程序总是“手动”触发的，例如通过单击按钮。另一方面，effect是“自动的”：它们根据需要运行和重新运行以保持同步。
// 有一个更精确的方法来思考这个问题。
// 在组件主体中声明的 props、state 和变量称为响应值。在此示例中， serverUrl 不是响应值，但 roomId 和 message 是。它们参与呈现数据流：
 
const serverUrl1 = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}

// 像这样的响应值可能会因重新渲染而更改。例如，用户可以编辑 message 或在下拉列表中选择其他 roomId 。事件处理程序和effect对更改的响应方式不同：

// 1. 事件处理程序中的逻辑不是响应式的。除非用户再次执行相同的交互（例如单击），否则它不会再次运行。事件处理程序可以读取反应性值，而无需对其更改“做出反应”

// 2. effect中的逻辑是反应性的。如果effect读取反应性值，则必须将其指定为依赖项。然后，如果重新渲染导致该值发生变化，React 将使用新值重新运行 Effect 的逻辑。

/**
 * 事件处理程序中的逻辑不是反应式的
 */


/**
 * effect内部的逻辑是反应性的
 */
// ...
const connection = createConnection(serverUrl, roomId);
connection.connect();
// ...

// 从用户的角度来看，对 roomId 的更改确实意味着他们想要连接到不同的房间。换句话说，连接到房间的逻辑应该是被动的。
// 您希望这些代码行“跟上”反应值，并在该值不同时再次运行。这就是为什么它属于effect：

useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect()
  };
}, [roomId]);

// effect是被动的，因此 createConnection(serverUrl, roomId) 和 connection.connect() 将针对每个不同的值 roomId 运行。您的effect使聊天连接与当前选定的聊天室保持同步。

/**
 * 从effect中提取non-reactive逻辑
 */


// 当您想将reactive逻辑与非reactive混合在一起时，事情变得更加棘手。


// 例如，假设您希望在用户连接到聊天时显示通知。您从道具中读取当前主题（深色或浅色），以便以正确的颜色显示通知：
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
  })
}

// 但是， theme 是一个 reactive value （它可以因重新渲染而更改），并且 Effect 读取的每个 reactive value 都必须声明为其依赖项。现在，您必须指定 theme 作为effect的依赖项：

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
}

// 试试这个例子，看看你是否能发现这个用户体验的问题：
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}


export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}


import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl4 = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl4, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

// 当 roomId 更改时，聊天会按预期重新连接。但由于 theme 也是一个依赖项，因此每次在深色和浅色主题之间切换时，聊天也会重新连接。那不是很好！
// 换句话说，你不希望这条线是reactive的，即使它在一个effect中（它是reactive）：
// ...
showNotification('Connected!', theme);
// ...

// 你需要一种方法来将这个非reactive逻辑与它周围的reactive效应分开。

/**
 * Declaring an Effect Event
 */

// 本节介绍一个尚未在稳定版 React 中发布的实验性 API。


// 使用一个名为 useEffectEvent 的特殊 Hook 从effect中提取此非reactive逻辑：

import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...

}

// 这里， onConnected 称为effect事件。它是 Effect 逻辑的一部分，但它的行为更像是一个事件处理程序。它里面的逻辑不是reactive的，它总是“看到”你的props和state的最新值。

// 现在，您可以从效果内部调用 onConnected effect事件：


function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...

}

// 这就解决了问题。请注意，您必须从effect依赖项列表中删除 onConnected 。effect事件不是reactive的，必须从依赖项中省略。

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}

import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl7 = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl7, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

// 您可以将effect事件视为与事件处理程序非常相似。主要区别在于事件处理程序运行以响应用户交互，而effect事件由您从effect触发。
// effct事件允许您在effect的reactive和不应是reactive的代码之间“打破链条”。

