import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import BarrierMoreInfo from './components/BarrierMoreInfo/BarrierMoreInfo';
import Criteries from './components/Criteries/Criteries';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Loading from './components/UI/Loading/Loading';

function App() {

  // const [manufacturers, setManufacturers] = useState([])
  // const [height, setHeight] = useState([])
  const [data, setData] = useState({
    manufacturers: [],
    height: [],
    ITT: [],
    dynProg: [],
    shStoek: [],
    rSh: [],
    mMarks: [],
    mPredTek: [],
  })

  // let { ogId } = useParams()


  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/getData')
      .then(response => response.json())
      .then(json => {
        // console.log(json)
        // setManufacturers(json.manufacturers)
        setData({
          manufacturers: json.manufacturers,
          height: json.height,
          ITT: json.ITT,
          dynProg: json.dynProg,
          shStoek: json.shStoek,
          rSh: json.rSh,
          mMarks: json.mMarks,
          mPredTek: json.mPredTek,
        })
        // setHeight(json.height)
      })

    // fetch('http://127.0.0.1:5000/api/getHeight')
    //   .then(response => response.json())
    //   .then(json => {
    //     setHeight(json)
    //   })
    //   console.log('Rerender')
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path='/' element={<div className="container">
          {data.manufacturers.length == 0
            || data.height.length == 0
            || data.ITT.length == 0
            || data.dynProg.length == 0
            || data.shStoek.length == 0
            || data.rSh.length == 0
            || data.mMarks.length == 0
            || data.mPredTek.length == 0
            ? <Loading />
            : <Criteries
              manufacturers={data.manufacturers}
              height={data.height}
              dynProg={data.dynProg}
              shStoek={data.shStoek}
              ITT={data.ITT}
              rSh={data.rSh}
              mMarks={data.mMarks}
              mPredTek={data.mPredTek}
            />}
        </div>} />
        <Route path='/barrier/:ogId' element={<BarrierMoreInfo />} />
        <Route path='*' />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;