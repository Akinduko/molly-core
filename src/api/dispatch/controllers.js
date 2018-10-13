import { genIdToken } from '../../utils/generateidtoken'
import { sendMail } from '../../utils/email'
import moment from 'moment';

export default ({ entities: { dispatch, users }, logger }) => ({
    dispatchById: async (req, res) => {
        let {status}=req.query
        let model
        try {
            model = dispatch.model()
        } catch (error) {
            model = dispatch.setModel()
        }
        try {
            const query = status? [{ _id: req.params.id},{ status }]:[{ _id: req.params.id }]
            const result = await dispatch.findOne(model, query)
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    dispatchByUser: async (req, res) => {
        let model
        let {status}=req.query
        try {
            model = dispatch.model()
        } catch (error) {
            model = dispatch.setModel()
        }
        try {
            const query = status? [{ user: req.params.id },{ status }]:[{ user: req.params.id }]
            const result = await dispatch.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    dispatchByRider: async (req, res) => {
        let model
        let {status}=req.query
        try {
            model = dispatch.model()
        } catch (error) {
            model = dispatch.setModel()
        }
        try {
            const query = status? [{ rider: req.params.id },{ status }]:[{ rider: req.params.id }]
            const result = await dispatch.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    dispatchByOwner: async (req, res) => {
        let model
        let {status}=req.query
        try {
            model = dispatch.model()
        } catch (error) {
            model = dispatch.setModel()
        }
        try {
            const query = status? [{ owner: req.params.id },{ status }]:[{ owner: req.params.id }]
            const result = await dispatch.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
})