import React from 'react'
import LoginForm from './LoginForm.jsx'
import AdminPanel from './AdminPanel.jsx'
// 条件表达
export default function Conditional() {
  let isLoggedIn = true
  // let content
  // if (isLoggedIn) {
  //   content = <AdminPanel />
  // } else {
  //   content = <LoginForm />
  // }
  // return <div>{content}</div>
  return (
    <>
      <div>{isLoggedIn ? <AdminPanel /> : <LoginForm />}</div>
      <div>{isLoggedIn && <AdminPanel />}</div>
    </>
  )
}
