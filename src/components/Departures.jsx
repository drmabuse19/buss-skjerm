import React, { useState, useEffect, useMemo } from 'react'
import { getNydalenDepartures } from "../api"
import "./Departures.css"

export default () => {
  const [deps, setDeps] = useState([])
  const [timeLoaded, setTimeLoaded] = useState(Date.now())

  const [timer, setTimer] = useState(null) //ID of interval refreshing list

  const filterDepartures = (deps, filter) => {
    return deps.filter(d => d.frontText !== filter)
  }

  const getDepartures = async () => {
    getNydalenDepartures().then(nydalenDeps => {
      const filteredDeps = filterDepartures(nydalenDeps, "Nydalen")
      setDeps(filteredDeps)
      setTimeLoaded(Date.now())
    })
  }

  useEffect(() => {
    getDepartures()
    const updateEveryMinute = setInterval(() => {
      getDepartures()
    }, 60000);
    setTimer(updateEveryMinute)
    return () => {
      clearInterval(timer)
    }
    //eslint-disable-next-line
  }, [])

  const whenLoaded = useMemo(() => {
    const date = new Date(timeLoaded).toLocaleDateString("default", {
      month: "long",
      day: "numeric"
    })
    const time = new Date(timeLoaded).toLocaleTimeString("default", {
      timeStyle: "short"
    })
    return `${date} ${time}`
  }, [timeLoaded])

  if(deps.length < 1){
    return(
      <div style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center"
      }}>
        <div className="loader">Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: "10vh 5vw",
      backgroundColor: "black",
      fontWeight: "bold",
      fontFamily: "sans-serif"
    }}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "5vw"}}>
        <h1 style={{color: "white", textAlign: "right"}}>NYDALEN</h1>
        <h1 style={{color: "white", textAlign: "left"}}>{whenLoaded}</h1>
      </div>
      {deps.map((dep, i) => {
        if(i < 10) {
          return <DepartureItem key={"dep_" + i} departure={dep}/>
        } else {
          return null
        }
      })}
    </div>
  )
}

const DepartureItem = ({ departure }) => {
  const {timeToDeparture, transport, publicCode, frontText} = departure

  const transportColor = useMemo(() => {
    if(transport === "metro"){
      return "#EC700C"
    } else {
      return "#E60000"
    }
  }, [transport])

  return(
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 4fr 1fr",
      alignItems: "center",
      margin: "1px"
    }}>
      <p style={{
        backgroundColor: transportColor, 
        color: "white", 
        padding: "1.5vh", 
        margin: "0",
        fontSize: "2.3em"
      }}>{publicCode}</p>
      <p style={{backgroundColor: "black", color: "white", textAlign: "left", paddingLeft: "2em" ,fontSize: "2.2em"}}>{frontText}</p>
      <p style={{
        backgroundColor: "black", 
        color: "white",
        margin: "0",
        fontSize: "2.2em"
      }}>{timeToDeparture} min</p>
    </div>
  )
}