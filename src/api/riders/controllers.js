import { genIdToken } from '../../utils/generateidtoken'
import moment from 'moment';
const logger = require('../../utils/logger').logger;
var ObjectId = require('mongoose').Types.ObjectId; 
export default ({ entities: { riders, auths ,dispatch} }) => ({
    getCurrentUser: async (req, res) => {
        let model
        try {
            model = riders.model()
        } catch (error) {
            model = riders.setModel()
        }
        try {
            const rider = await riders.findOne(model, [{ _id: req.user.id }])
            res.status(200).json(rider)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    getNear: async (req, res) => {
        try {
            let dispatchmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            }
            let { long, lat } = req.query
            const valid = long && lat ? true : false
            valid ? null : res.status(400).json({ error: "Location queries not provided" })
            const query =[[{$and:[{created:{$gt:moment().subtract(10, 'minutes').toDate().getTime()},status: 'requested' }]}]]
            const body = { details: [{ "type": "Point", "coordinates": [parseFloat(long), parseFloat(lat)] }, 100000,query,'origingeo.coordinates'] }
            const dispatches = valid ? await dispatch.findNear(dispatchmodel, body.details) : null
            res.status(200).json(dispatches)
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    cancelDispatch: async (req, res) => {
        try {
            let dispatchmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            }           
            let {reason}=req.body
            const valid = await dispatch.validateCancelDispatch({reason})
            const body ={reason}
            body['status']='cancelled'
            body['initiator']='rider'
            const result = valid ? await dispatch.update(dispatchmodel,req.params.id, body) : null
            valid ? res.status(200).json({ result }) : res.status(400).json({ error: "Invalid dispatch Body Parameters" })
            
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    acceptDispatch: async (req, res) => {
        try {
            let dispatchmodel;
            let ridersmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            } 
            try {
                ridersmodel = riders.model()
            } catch (error) {
                ridersmodel = riders.setModel()
            }          
            const current = await dispatch.findOne(dispatchmodel,[{ _id: req.params.id }])
            
            if(current.status==='requested'){
                const body =new Object;
                const riderresult = await riders.findOne(ridersmodel, [{ _id: req.user.id}])  
                body['owner']=riderresult&&riderresult.owner?riderresult.owner:'admin';
                body['status']='accepted';
                body['rider']=req.user.id;
                const result = await dispatch.update(dispatchmodel,req.params.id, body);
                res.status(200).json({ result });
                
            }
            else{
                logger.info({time:new Date(),user:req.user.id,error:"Event is no longer available" })
                res.status(400).json({ error: "Event is no longer available" })
                
            }

        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    startDispatch: async (req, res) => {
        try {
            let dispatchmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            }           
            const current = await dispatch.findOne(dispatchmodel,[{ _id: req.params.id },
                { status: 'accepted' },{ rider: req.user.id}])
            if(current.status==='accepted'){
                const body =new Object;
                body['status']='active';
                const result = await dispatch.update(dispatchmodel,req.params.id, body);
                res.status(200).json({ result });
                
            }
            else{
                logger.info({time:new Date(),user:req.user.id,error: "Event is no longer available" })
                res.status(400).json({ error: "Event is no longer available" })
                
            }

        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    deliverDispatch: async (req, res) => {
        try {
            let dispatchmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            }           
            const current = await dispatch.findOne(dispatchmodel,[{ _id: req.params.id },
                { status: 'active' },{ rider: req.user.id}])
            if(current.status==='active'){
                const body =new Object;
                body['status']='delivered';
                const result = await dispatch.update(dispatchmodel,req.params.id, body);
                res.status(200).json({ result });
                
            }
            else{
                logger.info({time:new Date(),user:req.user.id,error: "Event is no longer available" })
                res.status(400).json({ error: "Event is no longer available" })
                
            }

        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    update: async (req, res) => {
        const body = req.body
        let model
        try {
            model = riders.model()
        } catch (error) {
            model = riders.setModel()
        }
        try {
            await riders.validateUpdate(body)
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            res.status(400).json({ error: "Invalid Users Body Parameters" })
        }
        try {
            // body['_id'] =req.user.id
            const rider = await riders.update(model, req.user.id, body)
            res.status(200).json(rider)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    updateRole: async (req, res) => {
        const body = req.body
        const id = req.params.id
        let model
        try {
            model = users.model()
        } catch (error) {
            model = users.setModel()
        }
        try {
            const data = {}
            data['role'] = body['role']
            const user = await users.update(model, id, data)
            res.status(200).json(user)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    request: async (req, res) => {
        let model;
        try {
            model = riders.model()
        } catch (error) {
            model = riders.setModel()
        }
        let authmodel;
        try {
            authmodel = auths.model();
        } catch (error) {
            authmodel = auths.setModel();
        }

        const ridersbody = req.body
        try {
            const validateriders = await riders.validateCreate(ridersbody)
            ridersbody['created'] = Date.now();
            ridersbody['status'] = 'pending';
            ridersbody['active'] = false
            let { created, active, email } = ridersbody
            const auth = validateriders ? await auths.create(authmodel, { created, active, email }) : {};
            auth._id ? ridersbody['_id'] = auth._id : null
            const rider = validateriders ? await riders.create(model, ridersbody) : {}
            validateriders ? res.status(200).json(rider) : res.status(400).json({ error: "Invalid riders Body Parameters" })
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log({ error })
            error.err&&error.err.code===11000?res.status(400).json({ success:false,error: 'Rider details already exist' }):res.status(400).json({ success:false,error: {} })
        }
    },
})