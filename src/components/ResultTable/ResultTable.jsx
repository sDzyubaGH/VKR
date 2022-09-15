import React from 'react'
import Barrier from '../Barrier/Barrier'
import './ResultTable.css'


export default function ResultTable({ results }) {
    const resKeys = Object.keys(results)
    return (
        <div className="results">
            <div className='results__amount'>
                <span>Всего:  {resKeys && resKeys.length}</span>
            </div>

            <div className='headers'>
                <div className='cell'>№</div>
                <div className='cell'>Марка</div>
                <div className='cell'>Изготовитель</div>
                <div className='cell'>Чертеж</div>
                <div className='cell'>КЭ-модель</div>
                <div className='cell'></div>
            </div>
            {resKeys.map((key, idx) => {
                return (
                    <Barrier num={idx} key={results[key]['ogId']} barrier={results[key]} />
                )
            })}
        </div>
    )
}
