import { genIdToken } from '../../utils/generateidtoken'
const logger = require('../../utils/logger').logger;

export default ({ entities: { riders, auths, partners, payment } }) => ({

    getCurrentPartner: async (req, res) => {
        let model
        try {
            model = partners.model()
        } catch (error) {
            model = partners.setModel()
        }
        try {
            const partner = await partners.findOne(model, [{ _id: req.params.id }])
            res.status(200).json(partner)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    update: async (req, res) => {
        const body = req.body
        let model
        try {
            model = partners.model()
        } catch (error) {
            model = partners.setModel()
        }
        try {
            await partners.validateUpdate(body)
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            res.status(400).json({ error: "Invalid Users Body Parameters" })
        }
        try {
            // body['_id'] =req.user.id
            const partner = await partners.update(model, req.user.id, body)
            res.status(200).json(partner)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    request: async (req, res) => {
        let model;
        try {
            model = partners.model()
        } catch (error) {
            model = partners.setModel()
        }

        const partnersbody = req.body
        try {
            const validatepartners = await partners.validateCreate(partnersbody)
            partnersbody['created'] = Date.now();
            partnersbody['status'] = 'pending';
            partnersbody['active'] = false
            let { created, active, email, status, name, company, phonenumber, state, country,payment } = partnersbody
            const partner = validatepartners ?
                await partners.create(model, { created, active, email, status, name, company, phonenumber, state, country,payment }) : {};
            validatepartners ? res.status(200).json(partner) :
                res.status(400).json({ error: "Invalid partners Body Parameters" });
        }
        catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log({ error })
            error.err && error.err.code === 11000 ?
                res.status(400).json({ success: false, error: 'Partner details already exist' }) :
                res.status(400).json({ success: false, error: {} });
        }
    },
    getAllPayment: async (req, res) => { res.status(200).json('In progress') },
    getPaymentByRiders: async (req, res) => { res.status(200).json('In progress') },
    getAllDispatch: async (req, res) => { res.status(200).json('In progress') },
    getRidersbyId: async (req, res) => { res.status(200).json('In progress') },
    getAllRiders: async (req, res) => { res.status(200).json('In progress') },
    addRider: async (req, res) => { res.status(200).json('In progress') },
    getDispatchByRiders: async (req, res) => { res.status(200).json('In progress') },
})