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
      const filteredDeps = filterDepartures(nydalenDeps, "Teltusbakken")
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
    const time = new Date(timeLoaded).toLocaleTimeString("it-IT", {
      timeStyle: "short"
    })
    return ` ${time}`
  }, [timeLoaded])

  if(deps.length < 1){
    return(
      <div style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center",
        marginBottom: "-10%"
      }}>
        <div className="loader">Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      padding: "3vh 1.5vw",
      backgroundColor: "black",
      fontWeight: "bold",
      fontFamily: "sans-serif"
    }}>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "3vw"}}>
        <h1 style={{color: "white", textAlign: "right"}}>Telthusbakken  </h1>
        <h1 style={{color: "gray", textAlign: "right", fontSize:"4ch", margin: "0.1%", position:"absolute", marginLeft:"80%"}}>{whenLoaded}</h1>
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
      margin: "-30px",

    }}>
      <p style={{
        backgroundColor: transportColor, 
        color: "white", 
        margin: "0",
        fontSize: "2.3em",
        width:"50%",


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
