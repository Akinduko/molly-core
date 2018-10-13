import googlemaps from '@google/maps'
import CONFIG from '../config'

export const googleMaps = async () => {
    try {
        const googleMapsClient = await googlemaps.createClient({
            key: CONFIG.GOOGLE_API_KEY,
            Promise: Promise
          });
          return googleMapsClient
}
    catch (error) {
        console.log(error)
        return { error }
    }
}

