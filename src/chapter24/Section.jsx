import React from 'react'
import pageClasses from './page.module.css'

export default function Section({ level, children }) {
  return <section className={pageClasses.section}>{children}</section>
}
