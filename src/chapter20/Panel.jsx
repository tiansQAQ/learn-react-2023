import React, { useState } from 'react'

export default function Panel({ title, isActive, onShow, children }) {
  return (
    <>
      <h4>{title}</h4>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>显示</button>}
    </>
  )
}
