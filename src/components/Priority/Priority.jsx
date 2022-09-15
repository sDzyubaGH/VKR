import React from 'react'
import './Priority.css'

export default function Priority() {
  return (
    <select className='priority' type="number">
      <option defaultValue={0} value="">0</option>
      <option value="">1</option>
      <option value="">2</option>
      <option value="">3</option>
      <option value="">4</option>
      <option value="">5</option>
    </select>
  )
}
