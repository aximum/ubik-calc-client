import './UbikCalculator.css';

import { useEffect, useState } from 'react'
import Axios from 'axios'
import { TfiReload } from 'react-icons/tfi'
import { BsFillInfoCircleFill } from 'react-icons/bs'

const SelectedUbik = (props) => {

    const removeUbik = () => {
        props.setUbiks((ubiks) => ubiks.filter(e => e !== props.ubik))
    }

    return (

        <button className='selected-ubik-button selected-ubik-div' onClick={removeUbik}>
            <label className='selected-ubik'>{props.ubik}
            </label>X
        </button>

    )
}

const UbikCard = (props) => {
    return (
        <div className='ubik-card'>
            <img className='ubik-img' src={`https://m.baa.one/sheep/img/${props.ubik}`} alt={`Ubik ${props.ubik} `}></img>
            <label className='ubik-card-ubik ubik-card-label'>Ubik #{props.ubik}</label>
            <div className='ubik-card-info'>
                <label className='ubik-card-level ubik-card-label alt'>Level {props.level}</label>
                <label className='ubik-card-healthy ubik-card-label alt'>{props.healthy === 3 ? 'Unhealthy' : 'Healthy'}</label>
            </div>
            {/* <label className='ubik-card-mutated ubik-card-label'>Mutated: {props.mutated === 1.1 ? 'Yes' : 'No'}</label> */}
            <label className='ubik-card-revenue ubik-card-label'>Rev Share (%): {props.revenue.toFixed(4)}</label>
        </div>
    )
}



const UbikCalculator = () => {

    const [inputValue, setInputValue] = useState()
    const [ubiks, setUbiks] = useState([])

    const [ubikData, setUbikData] = useState([])
    const [totalRevenue, setTotalRevenue] = useState(0)

    const [isLoading, setIsLoading] = useState(false);
    const [hints, setHints] = useState(false);

    const onChangeHandler = event => {
        setInputValue(event.target.value)
    }

    const addUbik = event => {

        event.preventDefault()

        const duplicateCheck = ubiks.find((ubik) => ubik === inputValue)
        if (!duplicateCheck && inputValue !== '') {
            setUbiks((ubiks) => ubiks.concat(inputValue))
        }
        setInputValue('')
    }

    const calculateUbiks = () => {
        setIsLoading(true);
        Axios.post('https://ubik-calc-api.aximum96.workers.dev/api/ubiks', { 'ubiks': ubiks }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { setUbikData(response.data); setIsLoading(false) }).catch(() => {
            alert('Error')
            setIsLoading(false)
        })
    }

    useEffect(() => {
        let tempTotalRevenue = 0

        ubikData.forEach((ubik) => {
            tempTotalRevenue += ubik.revenue
        })
        setTotalRevenue(tempTotalRevenue)
    }, [ubikData])

    return (
        <>
            <video autoPlay loop muted playsInline preload='auto' className='bg-video'>
                <source src="https://s.baa.one/videos/landscape/landscape03.mp4" type="video/mp4"></source>
            </video>
            <img className='logo' alt='Ubik logo' src='/assets/Logo_2.png'></img>
            <h1 className="title">Ubik Rev Share (%) Calculator</h1>
            <div className='revenue-container'>
                <form className="form" onSubmit={addUbik}>
                    <input className="ubik-number-input" type="number" required value={inputValue} onChange={onChangeHandler} placehodler="111" min="1" max="1618"></input>
                    <input className='ubik-add-button' type="submit" value="Add Ubik #"></input>
                    <BsFillInfoCircleFill className='icon-var' onClick={() => {
                        hints ? setHints(false) : setHints(true)
                    }} />
                </form>
                {hints ? <p className='hints'><b>1.</b> Add your Ubik #s one at a time.<br></br>
                    <b>2.</b> Click 'Calculate Rev %'.<br></br>
                    <b>Note:</b> Values will change dynamically as Ubiks level up. <br></br>Allow ten minutes for new Upgrades to appear.</p> : <></>}
                {ubiks.map((ubik) => {
                    return (
                        <SelectedUbik ubik={ubik} setUbiks={setUbiks} />
                    )
                })}
                <button className={`calculate-button ${(ubiks.length === 0 ? 'disabled' : 'enabled')}`} onClick={calculateUbiks} disabled={isLoading}>Calculate Rev %</button>
                {isLoading ? <TfiReload className='icon' /> : ''}
                <div className='total-revenue-container'>
                    {(totalRevenue > 0) ? <label className='total-revenue-label'>Your Total Rev Share (%): {totalRevenue.toFixed(4)}</label> : <></>}
                </div>
                <div className='ubik-cards-list'>
                    {ubikData.map((ubik) => {
                        return (
                            <UbikCard ubik={ubik.ubik} level={ubik.level} healthy={ubik.healthy} mutated={ubik.mutated} weight={ubik.weight} revenue={ubik.revenue}></UbikCard>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default UbikCalculator;
