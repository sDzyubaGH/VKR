import React, { useEffect, useState } from 'react'
import RangeParam from '../RangeParam/RangeParam'
import Select from '../Select/Select'
import './Criteries.css'
import Priority from '../Priority/Priority'
import ResultTable from '../ResultTable/ResultTable'
import Loading from '../UI/Loading/Loading'

export default function Criteries(props) {

  const [goSearch, setGoSearch] = useState(false)
  const [results, setResults] = useState({})
  const [UUDEnUd, setUUDEnUd] = useState(0)
  const [params, setParams] = useState({
    class: {
      val: '',
      priority: 0
    },
    group: {
      val: '',
      priority: 0
    },
    subclass: {
      val: '',
      priority: 0
    },
    type: {
      val: '',
      priority: 0
    },
    subgroup: {
      val: '',
      priority: 0
    },
    manufacturer: {
      val: '',
      priority: 0
    },
    UUD: {
      val: '',
      priority: 0
    },
    enUdara: {
      val: '',
      priority: 0
    },
    height: {
      val: '',
      priority: 0
    },
    dynProg: {
      val: '',
      priority: 0
    },
    shSt: {
      val: '',
      priority: 0
    },
    manuf: [],
    modelType: [],
  })

  function materialClick(el) {
    if(el.checked) {
      document.querySelector('.materialMarks').hidden = false
      document.querySelector('.predTek').hidden = false

    }
    else {
      document.querySelector('.materialMarks').hidden = true
      document.querySelector('.predTek').hidden = true
    }
  }

  useEffect(() => {
    document.getElementById('UUS').checked = true
    setUUDEnUd(0)
  }, [])

  // useEffect(() => {
  //   window.localStorage.setItem('goResult', goResult)
  // }, [goResult])

  function getData() {
    setGoSearch(true)

    const mMarks = []
    let predTek = {}
    // Если чекбокч вкл, то собирать данные по материалам элементов
    if (document.querySelector('#material').checked) {
      // Маркировки
      const mMarksInputs = document.querySelectorAll('.mMark > input')
      mMarksInputs.forEach(mark => {
        if (mark.checked) {
          mMarks.push(mark.value)
        }
      })

      // Предел текучести
      predTek = {
        from: document.querySelector('.predTekfromInput').value,
        to: document.querySelector('.predTektoInput').value,
      }
    }



    let UUSEnUdaraInputs = []
    const UUS = []
    const enUdara = []
    if (UUDEnUd) {
      UUSEnUdaraInputs = document.querySelectorAll('.enUdaraChB > input')
      UUSEnUdaraInputs.forEach(el => {
        if (el.checked) {
          enUdara.push(el.value)
        }
      })
    } else {
      UUSEnUdaraInputs = document.querySelectorAll('.UUSChB > input')
      UUSEnUdaraInputs.forEach(el => {
        if (el.checked) {
          UUS.push(el.value)
        }
      })
    }


    // console.log(UUS, enUdara)

    const manufsInputs = document.querySelectorAll('.manufs > input')
    const manufs = []
    manufsInputs.forEach((man) => {
      // console.log(man.value)
      if (man.checked) {
        // console.log(man.value)
        manufs.push(man.value)
      }
    })

    const cls = document.querySelector('.class').value
    const group = document.querySelector('.group').value
    const subclass = document.querySelector('.subclass').value
    const type = document.querySelector('.type').value
    const subgroup = document.querySelector('.subgroup').value

    // const UUD = UUDEnUd ? document.querySelector('.enUdara').value : document.querySelector('.UUS').value

    const height = {
      from: document.querySelector('.heightfromInput').value,
      to: document.querySelector('.heighttoInput').value
    }

    const dynProg = {
      from: document.querySelector('.progibfromInput').value,
      to: document.querySelector('.progibtoInput').value
    }

    const ITT = {
      from: document.querySelector('.ITTfromInput').value,
      to: document.querySelector('.ITTtoInput').value,
    }

    const shSt = {
      from: document.querySelector('.ShStfromInput').value,
      to: document.querySelector('.ShSttoInput').value,
    }

    const rSh = {
      from: document.querySelector('.rShfromInput').value,
      to: document.querySelector('.rShtoInput').value,
    }

    const chertej = document.querySelector('#chertej')
    const KEModel = document.querySelector('#KEModel')
    const natProtocol = document.querySelector('#natProtocol')
    const modelType = {
      chertej: chertej.checked ? 'Чертежи' : 'no',
      KEModel: KEModel.checked ? 'КЭ-модель' : 'no',
      // natProtocol: natProtocol.checked ? 'Натурный протокол' : 'no',
    }

    // let formData = new FormData()
    // formData.append('name', 'John')
    const data = {
      class: cls,
      group: group,
      subclass: subclass,
      type: type,
      subgroup: subgroup,
      UUD: UUS,
      enUdara: enUdara,
      height: height,
      dynProg: dynProg,
      ITT: ITT,
      shSt: shSt,
      rSh: rSh,
      manufs: manufs,
      modelType: modelType,
      mMarks: mMarks,
      mPredTek: predTek,
    }

    // console.log(data)

    fetch('http://127.0.0.1:5000/api/postData', {
      body: JSON.stringify(data),
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {

          // window.localStorage.setItem('goResults', true)
        }
        // console.log(res)
        return res.json()
      })
      .then(res => {
        // console.log(res)
        setGoSearch(false)
        setResults(res)
        // window.localStorage.setItem('results', res)
        // setResults(res)
      })

    // download file
    // fetch('http://127.0.0.1:5000/api/test')
    //   .then(res => {
    //     if (res.ok) {
    //       res.blob()
    //         .then(blob => {
    //           console.log(blob)
    //           var url = window.URL.createObjectURL(blob);
    //           // document.querySelector('#frame').src = url
    //           // window.open(url)
    //           var a = document.createElement('a');
    //           a.href = url;
    //           a.download = "filename.pdf";
    //           document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    //           a.click();
    //           a.remove();  //afterwards we remove the element again    
    //         })
    //     }
    //   })

    setParams({
      class: {
        val: document.querySelector('.class').value,
      },
      group: {
        val: document.querySelector('.group').value,
      },
      subclass: {
        val: document.querySelector('.subclass').value,
      },
      type: {
        val: document.querySelector('.type').value,
      },
      subgroup: {
        val: document.queryCommandIndeterm('.subgroup').value,
      },
      manufacturer: {
        // val: document.querySelector()
      }
    })
    // console.log(params)
  }

  // if (goSearch && Object.keys(results).length == 0) {
  //   return <Loading />
  // }

  // if (goSearch && Object.keys(results).length) {
  //   return <ResultTable results={results} />
  // }
  // else
  return (
    <div>
      <div className="criteries">
        <div className="labels">
          <h2>Выберите критерии поиска</h2>
          <h2>Задайте приоритеты от 0 (минимальный) до 5 (максимальный)</h2>
        </div>
        <div className='param'>
          <div className="criterion">
            <Select selectClass='class' title='Класс'>
              <option value="all">Все</option>
              <option value="боковое">Боковые</option>
              <option value="фронтальное">Фронтальные</option>
            </Select>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <Select selectClass='group' title='Группа'>
              {/* <option defaultValue disabled value="">Группа</option> */}
              <option value="all">Все</option>
              <option value="дорожное">Дорожные</option>
              <option value="мостовое">Мостовые</option>
            </Select>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <Select selectClass='subclass' title='Подкласс'>
              {/* <option defaultValue disabled value="">Подкласс</option> */}
              <option value="all">Все</option>
              <option value="недеформируемое">Недеформируемые</option>
              <option value="деформируемое">Деформируемые</option>
            </Select>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <Select selectClass='type' title='Тип'>
              {/* <option defaultValue disabled value="">Тип</option> */}
              <option value="all">Все</option>
              <option value="удерживающее барьерное">Удерживающее барьерное</option>
              <option value="парапетное">Парапетное</option>
              <option value="тросовое">Тросовое</option>
            </Select>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <Select selectClass='subgroup' title='Подгруппа'>
              {/* <option defaultValue disabled value="">Подгруппа</option> */}
              <option value="all">Все</option>
              <option value="одностороннее">Одностороннее</option>
              <option value="двухстороннее">Двустороннее</option>
            </Select>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>

        <div className="param">
          <div className="criterion">
            {/* {console.log(props.height)} */}
            <RangeParam
              className="height"
              min={props.height[0][0]}
              max={props.height[0][1]}
              title='Выстота'></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <RangeParam className="progib" title='Динамический прогиб'
              min={props.dynProg[0][0]}
              max={props.dynProg[0][1]}
            ></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <RangeParam className="ITT" title='Индекс тяжести травм'
              min={props.ITT[0][0]}
              max={props.ITT[0][1]}
            ></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <RangeParam className="ShSt" title='Шаг стоек'
              min={props.shStoek[0][0]}
              max={props.shStoek[0][1]}
            ></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <RangeParam className="rSh" title='Рабочая ширина'
              min={props.rSh[0][0]}
              max={props.rSh[0][1]}
            ></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>

        <div className="param">
          <div className="criterion">
            <h2><input onClick={e => materialClick(e.target)} value={true} id='material' type="checkbox" />Поиск по материалам элементов ограждения</h2>
            <div className='materialMarks'>
              {props.mMarks.map((mark, i) => {
                return (mark[0] != null && <div className='mMark' key={i}>
                  <input type='checkbox' id={'mMark' + i} value={mark} name='mMarks' />
                  <label htmlFor={"mMark" + i}>{mark}</label>
                </div>)
              })}
            </div>
            <RangeParam className="predTek" title='Предел текучести'
              min={props.mPredTek[0][0]}
              max={props.mPredTek[0][1]}
            ></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>

        {/* <div className="param">
          <div className="criterion">
            <RangeParam className="weight" title='Вес'></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div> */}
        {/* <div className="param">
          <div className="criterion">
            <RangeParam className="price" title='Цена'></RangeParam>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div> */}
        <div className="param">
          <div className="criterion">
            <div className='radioBtn'>
              <input onChange={() => setUUDEnUd(0)} name='UUDEnUd' id="UUS" type="radio" />
              <label htmlFor="UUS">
                Уровень удерживающей способности
              </label>
            </div>
            <div className='radioBtn'>
              <input onChange={() => setUUDEnUd(1)} name='UUDEnUd' id="enUdara" type="radio" />
              <label htmlFor="enUdara">
                Энергия удара
              </label>
            </div>

            {UUDEnUd == 0
              ?
              // <Select selectClass="UUS" title='Уровень удерживающей способности'>
              //   <option value="У1">У1</option>
              //   <option value="У2">У2</option>
              //   <option value="У3">У3</option>
              //   <option value="У4">У4</option>
              //   <option value="У5">У5</option>
              //   <option value="У6">У6</option>
              //   <option value="У7">У7</option>
              //   <option value="У8">У8</option>
              //   <option value="У9">У9</option>
              //   <option value="У10">У10</option>
              // </Select>
              <div className='UUS'>
                <div className='UUSChB'>
                  <input id='UUS1' value='У1' name='UUS' type='checkbox' />
                  <label htmlFor="UUS1">У1</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS2' value='У2' name='UUS' type='checkbox' />
                  <label htmlFor="UUS2">У2</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS3' value='У3' name='UUS' type='checkbox' />
                  <label htmlFor="UUS3">У3</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS4' value='У4' name='UUS' type='checkbox' />
                  <label htmlFor="UUS4">У4</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS5' value='У5' name='UUS' type='checkbox' />
                  <label htmlFor="UUS5">У5</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS6' value='У6' name='UUS' type='checkbox' />
                  <label htmlFor="UUS6">У6</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS7' value='У7' name='UUS' type='checkbox' />
                  <label htmlFor="UUS7">У7</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS8' value='У8' name='UUS' type='checkbox' />
                  <label htmlFor="UUS8">У8</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS9' value='У9' name='UUS' type='checkbox' />
                  <label htmlFor="UUS9">У9</label>
                </div>
                <div className='UUSChB'>
                  <input id='UUS10' value='У10' name='UUS' type='checkbox' />
                  <label htmlFor="UUS10">У10</label>
                </div>
              </div>
              :
              // <Select selectClass="enUdara" title='Энергия удара'>
              //   <option value="130">130</option>
              //   <option value="190">190</option>
              //   <option value="250">250</option>
              //   <option value="300">300</option>
              //   <option value="350">350</option>
              //   <option value="400">400</option>
              //   <option value="450">450</option>
              //   <option value="500">500</option>
              //   <option value="550">550</option>
              //   <option value="600">600</option>
              // </Select>
              <div className='enUdara'>
                <div className='enUdaraChB'>
                  <input id='enUdara1' value='130' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara1">130</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara2' value='190' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara2">190</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara3' value='250' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara3">250</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara4' value='300' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara4">300</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara5' value='350' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara5">350</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara6' value='400' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara6">400</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara7' value='450' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara7">450</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara8' value='500' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara8">500</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara9' value='550' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara9">550</label>
                </div>
                <div className='enUdaraChB'>
                  <input id='enUdara10' value='600' name='enUdara' type='checkbox' />
                  <label htmlFor="enUdara10">600</label>
                </div>
              </div>
            }
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <div className='manufacturer'>
              <h2>Производитель</h2>
              {props.manufacturers.map((man, i) => {
                return (<div className='manufs' key={i}>
                  <input type='checkbox' id={'manuf' + i} value={man} name='manufacturers' />
                  <label htmlFor={"manuf" + i}>{man}</label>
                </div>)
              })}
            </div>
            {/* <Select selectClass='manufacturer' title='Производитель'>
              <option disabled value="">Производитель</option>
              {props.manufacturers && props.manufacturers.map((man, i) => {
                return <option key={i} value={man}>{man}</option>
              })}
            </Select> */}
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
        <div className="param">
          <div className="criterion">
            <div className="modelType">
              <h2>Тип модели</h2>
              <div className='chertej'>
                <input type='checkbox' id='chertej' value='Чертежи' name='modelType' />
                <label htmlFor='chertej'>Чертеж</label>
              </div>
              <div className="KEModel">
                <input type="checkbox" name="KEModel" value='КЭ-модель' id="KEModel" />
                <label htmlFor='KEModel'>КЭ-модель</label>
              </div>
              {/* <div className="natProtocol">
                <input type="checkbox" name="natProtocol" value='Натурный протокол' id="natProtocol" />
                <label htmlFor='natProtocol'>Натурный протокол</label>
              </div> */}
            </div>
          </div>
          <div className="criteries__priority">
            <Priority />
          </div>
        </div>
      </div>
      <div className="search">
        <button onClick={getData} className='search__btn'>Поиск</button>
      </div>

      {/* {Object.keys(results).length != 0 && results['noResults'] ? <p>No results</p> : <ResultTable results={results} />} */}
      {/* {console.log(results)} */}
      {!goSearch && Object.keys(results).length != 0 ? <ResultTable results={results} /> : <div></div>}
      {goSearch ? <Loading /> : <div></div>}

      {/* {!goSearch && Object.keys(results).length == 0 ? <p>Нет данных</p> : <div></div>} */}

      {/* <iframe id='frame' src="banner.html" width="468" height="60" align="left">
        Ваш браузер не поддерживает плавающие фреймы!
      </iframe> */}
    </div>
  )
}
