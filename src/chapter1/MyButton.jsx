// css采用模块化
import classes from './button.module.css'
import React from 'react'

export default function MyButton() {
  return <button className={`${classes.btn} ${classes['btn-border']}`}>I am button</button>
}
