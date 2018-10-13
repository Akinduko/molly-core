import {genIdToken} from '../../utils/generateidtoken'

export default ({ entities: { users ,dispatch} }) => ({
    requestDispatch: async (req, res) => {
        try {
            let dispatchmodel;
            try {
                dispatchmodel = dispatch.model()
            } catch (error) {
                dispatchmodel = dispatch.setModel()
            }

            const body = req.body
            const valid = await dispatch.validateRequest(body)
            body['created']= Date.now()
            body['status']= 'requested'
            body['user']= req.user.id
            let {originlat,originlng}=req.body.origingeo
            const origingeo = {"type":"point","coordinates":[parseFloat(originlng),parseFloat(originlat)]}
            body['origingeo']= origingeo
            let {destinationlat,destinationlng}=req.body.destinationgeo
            const destinationgeo = {"type":"point","coordinates":[parseFloat(destinationlng),parseFloat(destinationlat)]}
            body['destinationgeo']= destinationgeo
            const result = valid ? await dispatch.create(dispatchmodel, body) : null
            valid ? res.status(200).json({ result }) : res.status(400).json({ error: "Invalid dispatch Body Parameters" })
            
        }
        catch (error) {
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
            body['initiator']='user'
            const result = valid ? await dispatch.update(dispatchmodel,req.params.id, body) : null
            valid ? res.status(200).json({ result }) : res.status(400).json({ error: "Invalid dispatch Body Parameters" })
            
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    getCurrentUser: async (req, res) => {
        let model
        try {
            model = users.model()
        } catch (error) {
             model = users.setModel()
        }
        try {
            const user = await users.findOne(model,[{_id:req.user.id}])
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    update: async (req, res) => {
        const body = req.body
        let model
        try {
            model = users.model()
        } catch (error) {
             model = users.setModel()
        }
        try{
            await users.validateUpdate(body)
        }
        catch(error){
            res.status(400).json({ error: "Invalid Users Body Parameters" })
        }
        try {
            // body['_id'] =req.user.id
            const user = await users.update(model,req.user.id,body)
            res.status(200).json(user)
        } catch (error) {
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
            data['role']=body['role']
            const user = await users.update(model,id,data)
            console.log(user)
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
})