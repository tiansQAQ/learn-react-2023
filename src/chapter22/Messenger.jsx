import React, { useState } from 'react'
const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
]
// 使用 key 重置表单
// 使用 key 来重置 state 在处理表单时特别有用。
// 使用 key 这样确保了当你选择一个不同的收件人时， Chat 组件——包括其下方树中的任何 state——都将从头开始重新创建。 React 还将重新创建 DOM 元素，而不是复用它们。
export default function Messenger() {
  const [to, setTo] = useState(contacts[0])

  return (
    <div>
      <ContactList contacts={contacts} onSelect={(contact) => setTo(contact)} />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

function Chat({ contact }) {
  const [text, setText] = useState('')

  return (
    <section className="chat">
      <textarea value={text} placeholder={'跟 ' + contact.name + '聊一聊'} onChange={(e) => setText(e.target.value)}></textarea>
      <button>发送到 {contact.email}</button>
    </section>
  )
}

function ContactList({ contacts, onSelect }) {
  return (
    <section>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                onSelect(contact)
              }}
            >
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
