import React from 'react'
import { Link } from 'react-router-dom'
import downloadFile from '../../functions'
import './Barrier.css'

export default function Barrier({ barrier, num }) {

    // function clickBtn() {
    //     console.log(barrier['ogId'])
    // }

    function download(e) {
        downloadFile(e.target.innerText, 'barrier')
    }

    return (
        <div className="results__barrier-row">
            <div className='results__num cell'>{num + 1}</div>
            <div className='results__mark cell'>{barrier['mark']}</div>
            <div className='results__manuf cell'>{barrier['manuf']}</div>
            <div className='results__chert cell'>
                {barrier['chert']
                    ? <p className='fileParam' onClick={e => download(e)}>{barrier['chert']}</p>
                    : <p>—</p>}
            </div>
            <div className='results__KEModel cell'>
                {barrier['KEModel']
                    ? <p className='fileParam' onClick={e => download(e)}>{barrier['KEModel']}</p>
                    : <p>—</p>}
            </div>
            <div className='results__more-info cell'>
                <Link to={`/barrier/${barrier['ogId']}`}>
                    <button>Подробнее</button>
                </Link>
            </div>
        </div>
    )
}
