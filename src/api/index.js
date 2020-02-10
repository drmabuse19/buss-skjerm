import { getDepartures } from "./departures"

/**
 * 
 * returns Array<{
 *  timetoDeparture: number
 *  transport: string
 *  publicCode: number
 *  frontText: string
 * }>
 * 
 */
export const getNydalenDepartures = async () => {
  const nydalen = {
    name: "Telthusbakken",
    featureArray: [
      "NSR:StopPlace:6290"
    ]
  }
  const departures = await getDepartures(nydalen.featureArray[0], 20)


  const activeDepartures = []
  await departures.forEach(dep => {
    const timeToDeparture = Math.floor(((new Date(dep.departureTime) - Date.now())/1000)/60)
    if(timeToDeparture <= 0) return
    activeDepartures.push({...dep, timeToDeparture})
  })
  const sortedDepartures = await activeDepartures.sort((a, b) => a.timeToDeparture - b.timeToDeparture)
  return await sortedDepartures.map(dep => {
    /* console.log(`
      ---
      time: ${new Date(dep.departureTime).toLocaleTimeString("default")},
      timeToDeparture: ${dep.timeToDeparture} min,
      transport: ${dep.transportMode},
      text: ${dep.publicCode} ${dep.frontText}
      ---`) */
    return {
      timeToDeparture: dep.timeToDeparture,
      transport: dep.transportMode,
      publicCode: dep.publicCode,
      frontText: dep.frontText
    }
  }) 
}
