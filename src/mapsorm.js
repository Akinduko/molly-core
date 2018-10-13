import config from './config';
export default (maps) => {
    return {
        /*
        Get db connection
        */
        getDistance: async (data) => {
            const googleMapsClient = require('@google/maps').createClient({
                key: config.GOOGLE_API_KEY,
                Promise: Promise
              });    
            return new Promise(async (resolve, reject) => {
                try {
                    const inOneHour = new Date().getTime() + 60 * 60 * 1000;
                    googleMapsClient.distanceMatrix({
                        origins:data[0],
                        destinations: data[1],
                        departure_time: inOneHour,
                        mode: 'driving',
                        avoid: ['tolls', 'ferries'],
                        traffic_model: 'best_guess'
                      }) .asPromise()
                      .then((response) => {
                        console.log({origins:data[0],destinations:data[1]})
                        resolve(response.json.results?response.json.results:response.json)
                      })
                      .catch((err) => {
                        console.log(err);
                        reject({ err: err })
                      });
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        geoDecode: async (data) => {
            const googleMapsClient = require('@google/maps').createClient({
                key: config.GOOGLE_API_KEY,
                Promise: Promise
              });    
            return new Promise(async (resolve, reject) => {
                try {
                    googleMapsClient.geocode({address: data}) .asPromise()
                      .then((response) => {
                        resolve(response.json.results?response.json.results:response.json)
                      })
                      .catch((err) => {
                        console.log(err);
                        reject({ err: err })
                      });
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        }
    }
}
