import React, { useEffect, useState } from 'react'
import Priority from '../Priority/Priority'
import './RangeParam.css'

export default function RangeParam(props) {

  // console.log(props.height)
  // console.log(props.height)
  const [from, setFrom] = useState(parseFloat(props.min))
  const [to, setTo] = useState(parseFloat(props.max))

  const step = (props.max - props.min) / 100

  const [range, setRange] = useState({
    minVal: props.min,
    maxVal: props.max,
  })

  // let minVal = 0
  // let maxVal = 100

  // if (props.height) {
  //   minVal = props.height[0]
  //   maxVal = props.height[1]
  // }

 

  // useEffect(() => {
  //   if (props.min && props.max) {
  //     setRange({
  //       minVal: props.min,
  //       maxVal: props.max
  //     })
  //     console.log(range)
  //   }
  //   // setTo(props.to)
  // }, [])

  function fromChange(val) {
    if(val > to) 
      return

    setFrom(val)
  }

  // function fromInputChange(val) {
  //   setFrom(val)
  // }

  function toChange(val) {
    if(val < from) 
      return

    setTo(val)
  }

  // function toInputChange(val) {
  //   setTo(val)
  // }

  return (
    <div id='rangeParam' className={props.className}>
      {props.title && <div className='rangeParam__title'>
        {/* <Priority /> */}
        <h2 className='rangeParamTitle'>{props.title}</h2>
      </div>}
      <div className="from">
        <label>От</label>
        <input className={props.className + 'rangeFrom'} min={range.minVal} max={range.maxVal} type="range" value={from} step={step} onChange={(e) => fromChange(e.target.value)} />
        <input className={props.className + 'fromInput'} min={range.minVal} max={range.maxVal} type="number" value={from} step={step} onChange={(e) => fromChange(e.target.value)} />
      </div>
      <div className="to">
        <label htmlFor="">До</label>
        <input className={props.className + 'rangeTo'} min={range.minVal} max={range.maxVal} type="range" value={to} step={step} onChange={(e) => toChange(e.target.value)} />
        <input className={props.className + 'toInput'} min={range.minVal} max={range.maxVal} type="number" value={to} step={step} onChange={(e) => toChange(e.target.value)} />
      </div>
    </div>
  )
}
