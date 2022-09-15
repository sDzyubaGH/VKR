import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../UI/Loading/Loading'
import './BarrierMoreInfo.css'

export default function BarrierMoreInfo() {
  let { ogId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({})

  console.log(Object.keys(data).length)

  const goBack = () => navigate(-1)

  useEffect(() => {
    const postData = {
      ogId: ogId,
    }

    fetch('http://127.0.0.1:5000/api/getCurrBarrier', {
      body: JSON.stringify(postData),
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then(res => setData(res))

  }, [])

  // download file
  // fetch('http://127.0.0.1:5000/api/test')
  //   .then(res => {
  //     if (res.ok) {
  //       res.blob()
  //         .then(blob => {
  //           var url = window.URL.createObjectURL(blob);
  //           document.querySelector('#frame').src = url
  //           // window.open(url)
  //           // var a = document.createElement('a');
  //           // a.href = url;
  //           // a.download = "filename.pdf";
  //           // document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
  //           // a.click();
  //           // a.remove();  //afterwards we remove the element again    
  //         })
  //     }
  //   })


  function downloadFile(e, belonging) {
    // console.log(e.innerText)
    let url = ''
    if (belonging == 'barrier')
      url = 'http://127.0.0.1:5000/api/getBarFile'
    else if (belonging == 'element') url = 'http://127.0.0.1:5000/api/getElemFile'

    const postData = {
      fName: e.innerText
    }

    fetch(url, {
      body: JSON.stringify(postData),
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      // .then(res => res.blob)
      .then(res => {
        if (res.ok) {
          res.blob()
            .then(blob => {
              console.log(blob)
              var url = window.URL.createObjectURL(blob);
              // document.querySelector('#frame').src = url
              // window.open(url)
              var a = document.createElement('a');
              a.href = url;
              a.download = e.innerText;
              document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
              a.click();
              a.remove();  //afterwards we remove the element again    
            })
        }
      })
  }

  return (
    <div className='barrier-info'>
      {Object.keys(data).length != 0
        ?
        <div className='container'>
          <div className='back'>
            <button onClick={goBack} className='back__btn'>Назад</button>
          </div>
          <div className='barrier-info__mainInfo'>
            <h2 className='barrier-info__mainInfo-title'>Информация по ограждению</h2>
            <div className='barrier-info__mainInfo-container'>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Марка</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['mark']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Класс</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['class']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Группа</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['group']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Подгруппа</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['subgroup']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Тип</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['type']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Уровень удерживающей способности</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['UUS'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Энергия удара</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['enUdara'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Высота</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['height'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Динамический прогиб</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['dynProg'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Рабочая ширина</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['rSh'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Шаг стоек</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['shSt'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Производитель</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['manuf']}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Индекс тяжести травм</p>
                </div>
                <div className="paramValue param-cell">
                  <p>{data['ITT'] || '—'}</p>
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>КЭ-модель</p>
                </div>
                <div className="paramValue param-cell">
                  {data['KEModel']
                    ? <p className='fileParam' onClick={e => downloadFile(e.target, 'barrier')}>{data['KEModel']}</p>
                    : <p>—</p>}
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Чертежи</p>
                </div>
                <div className="paramValue param-cell">
                  {data['chert']
                    ? <p className='fileParam' onClick={e => downloadFile(e.target, 'barrier')}>{data['chert']}</p>
                    : <p>—</p>}
                </div>
              </div>
              <div className='barrier-info__mainInfo-param'>
                <div className="paramName param-cell" >
                  <p>Натурный протокол</p>
                </div>
                <div className="paramValue param-cell">
                  {data['natProt']
                    ? <p className='fileParam' onClick={e => downloadFile(e.target, 'barrier')}>{data['natProt']}</p>
                    : <p>—</p>}
                </div>
              </div>
            </div>

            <h2 className='barrier-info__elements-title'>Информация по элементам ограждения</h2>
            {Object.keys(data['elements']).length != 0
              ?
              <div className='barrier-info__elements'>
                {Object.keys(data['elements']).map(elem =>
                  <div className='barrier-info__elements'>
                    <div className='barrier-info__elements-container'>
                      <h2>{data['elements'][elem]['name']}</h2>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Марка</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mark'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Высота</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['height'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Длина</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['length'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Приналдежность</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['prin'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Толщина</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['tolshina'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Ширина</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['width'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Профиль</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['profile'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>КЭ-модель</p>
                        </div>
                        <div className="paramValue param-cell">
                          {data['elements'][elem]['elemFiles']['KEModel']
                            ? <p className='fileParam' onClick={e => downloadFile(e.target, 'element')}>{data['elements'][elem]['elemFiles']['KEModel']}</p>
                            : <p>—</p>
                          }
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>3D-модель</p>
                        </div>
                        <div className="paramValue param-cell">
                          {data['elements'][elem]['elemFiles']['3DModel']
                            ? <p className='fileParam' onClick={e => downloadFile(e.target, 'element')}>{data['elements'][elem]['elemFiles']['3DModel']}</p>
                            : <p>—</p>}
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Чертежи</p>
                        </div>
                        <div className="paramValue param-cell">
                          {data['elements'][elem]['elemFiles']['chert']
                            ? <p className='fileParam' onClick={e => downloadFile(e.target, 'element')}> {data['elements'][elem]['elemFiles']['chert']}</p>
                            : <p>—</p>
                          }
                        </div>
                      </div>

                      <h2 className='material-info'>Материал</h2>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Наименование материала</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mName'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Маркировка</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mMark'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Модуль упругости</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mModUpr'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Предел прочности</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mPredProchn'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Предел текучести</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mPredTek'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Относительное удлинение</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['otUdl'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Относительное сужение</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['otSuz'] || '—'}</p>
                        </div>
                      </div>
                      <div className='barrier-info__element-param'>
                        <div className="paramName param-cell" >
                          <p>Плотность</p>
                        </div>
                        <div className="paramValue param-cell">
                          <p>{data['elements'][elem]['mPlotn'] || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              :
              <p>Нет данных</p>}
          </div>
        </div>
        : <Loading />
      }
    </div >
  )
}
