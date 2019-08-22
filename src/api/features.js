import service from "./entur"

//TAKES A FEATURE AND RETURNS AN OBJECT WITH RELEVANT DATA
const getFeatureData = (feature) => {
  return {
    coordinates: {
      lat: feature.geometry.coordinates[0],
      long: feature.geometry.coordinates[1]
    },
    id: feature.properties.id,
    name: feature.properties.name
  }
}

const getFeatureDataArray = async (features, stops) => {
  let array = []

  for(let i = 0; i < stops; i++){
    array.push(getFeatureData(features[i]))
  }

  return await array
}

//TAKES A LOCATION STRING AND RETURNS AN ARRAY OF {stops} STOPS, UP TO 10
const getFeatures = async (location, stops = 10) => {
  let stopsToReturn = stops
  const feats = await service.getFeatures(location)

  if(await feats.length < stops) {
    stopsToReturn = feats.length
  }

  const features = await getFeatureDataArray(feats, stopsToReturn)
  console.log(`Returning array of ${stopsToReturn} features`)

  return await features
}

export default getFeatures