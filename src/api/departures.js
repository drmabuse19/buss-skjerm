import service from "./entur"

const defaultOptions = {
  startTime: Date.now(), //ISO8601 string aka ms siden 01.01.1970
  timeRange: 108000, //number
  departures: 5, //number
  includeNonBoarding: false //boolean
}

/**
 * @param {string} id - ID returned by Feature
 */
const getStopPlaceDeparturesByID = async (id, options = defaultOptions) => {
    const departures = await service.getStopPlaceDepartures(id, options)
    const depArray = await departures.map(dep => {
      return {
        departureTime: dep.aimedDepartureTime,
        frontText: dep.destinationDisplay.frontText,
        publicCode: dep.serviceJourney.journeyPattern.line.publicCode,
        transportMode: dep.serviceJourney.transportSubmode
      }
    })

    return await depArray
}

const getDepartureArray = async (features, depsToReturn, depOpts = defaultOptions) => {
  let depArr = []
  for(let i = 0; i < depsToReturn; i++){
    const departures = await getStopPlaceDeparturesByID(features[i].id, depOpts)
    depArr.push({
      stop: features[i].name,
      coordinates: features[i].coordinates,
      departures: departures
    })
  }
  return depArr
}

export const getDepartures = async (id, departures) => {
  const deps = await getStopPlaceDeparturesByID(id, {...defaultOptions, departures})
  return await deps
}