import { genIdToken } from '../../utils/generateidtoken'
import { sendMail } from '../../utils/email'
import moment from 'moment';
const logger = require('../../utils/logger').logger;

export default ({ entities: { locations, users } }) => ({
    broadcast: async (req, res) => {
        try {
            let locationmodel;
            try {
                locationmodel = locations.model()
            } catch (error) {
                locationmodel = locations.setModel()
            }

            const body = req.body
            const valid = await locations.validateBroadcast(body)
            body['created']= Date.now()
            body['owner']=req.user.id
            let {lat,lng}=req.body.geometry
            const geometry = {"type":"point","coordinates":[parseFloat(lng),parseFloat(lat)]}
            body['geometry']= geometry
            valid ? null : res.status(400).json({ error: "Invalid Broadcast Body Parameters" })
            const location = valid ? await locations.create(locationmodel, body) : null
            res.status(200).json({ location })
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    getNear: async (req, res) => {
        try {
            let locationmodel;
            try {
                locationmodel = locations.model()
            } catch (error) {
                locationmodel = locations.setModel()
            }
            let { long, lat } = req.query
            const valid = long && lat ? true : false
            valid ? null : res.status(400).json({ error: "Location queries not provided" })
            const query =[[{$and:[{created:{$gt:moment().subtract(10, 'minutes').toDate().getTime()},available: true }]}]]
            const body = { details: [{ "type": "Point", "coordinates": [parseFloat(long), parseFloat(lat)] }, 100000,query,'geometry.coordinates'] }

            const location = valid ? await locations.findNear(locationmodel, body.details) : null
            res.status(200).json(location)
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    calculateDistance: async (req, res) => {
        try {
            const valid = await locations.validateCalculate(req.body)
            let {origin,destination} =req.body
            const body= [[origin],[destination]]
            const location =valid ? await locations.calculateDistance(body) :null
            valid? res.status(200).json(location): res.status(400).json({ error: "Invalid Loation Parameters" })
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    getEstimate: async (req, res) => {
        try {
            const valid = await locations.validateCalculate(req.body.geolocations)
            let {origin='',destination=''} =req.body.geolocations
            let {dimension=0} =req.body.dimension
            const body= [[origin],[destination]]
            const location =valid ? await locations.calculateDistance(body) :null
            const data = location.rows[0].elements[0]
            let {distance={text:0},duration_in_traffic={text:0},duration}=data
            const costperdim=0;
            const costperdist=65;
            const totalcost =(parseInt(distance.text.split(' ')[0])*costperdist) +(costperdim*dimension)
            const result = {totalcost,ETA:duration_in_traffic.text}
            valid? res.status(200).json(result): res.status(400).json({ error: "Invalid Loation Parameters" })
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },

})