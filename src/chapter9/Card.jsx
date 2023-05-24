import React from 'react'

// 将 JSX 作为子组件传递
export default function Card({ children }) {
  return (
    <div className="card" style={{ border: '1px solid #555', borderRadius: '4px' }}>
      {children}
    </div>
  )
}
