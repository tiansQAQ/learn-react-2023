import React from 'react'
import pageClasses from './page.module.css'
import { LevelContext } from './LevelContext'

export default function Section({ children }) {
  return (
    <section className={pageClasses.section}>
      <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
    </section>
  )
}
