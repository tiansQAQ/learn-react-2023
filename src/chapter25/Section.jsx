import React, { useContext } from 'react'
import { LevelContext } from './LevelContext.js'
import pageClasses from './page.module.css'
export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext)
  return (
    <section className={pageClasses.section + (isFancy ? ` ${pageClasses.fancy}` : '')}>
      <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
    </section>
  )
}
