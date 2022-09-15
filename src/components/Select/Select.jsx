import React from 'react'
import './Select.css'

export default function Select(props) {

  // props.classChange()

  return (
    <div className='select'>
      {props.title && <div className='select__title'>
        {/* <Priority /> */}
        <h2>{props.title}</h2>
      </div>}
      <select className={props.selectClass}>{props.children}</select>
    </div>
  )
}
