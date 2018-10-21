const logger = require('../../utils/logger').logger;
var ObjectId = require('mongoose').Types.ObjectId; 
export default ({ entities: { payments,dispatch,users } }) => ({

    create: async (req, res) => {
        const body = req.body
        let model
        let dispatchmodel
        let usersmodel
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            dispatchmodel = dispatch.model()
        } catch (error) {
            dispatchmodel = dispatch.setModel()
        }
        try {
            usersmodel = users.model()
        } catch (error) {
            usersmodel = users.setModel()
        }
        try {
            const query = [{ _id: new ObjectId(req.params.id)}];
            const dispatchresult = await dispatch.findOne(dispatchmodel, query)  ;
             const {owner,rider,user}=dispatchresult;
             const userresult = await users.findOne(usersmodel, [{ _id: user}])  ;
             const {email,phonenumber}=userresult;
            const valid = await payments.validateCreate(body);
            const payment = valid ? await payments.create(model, {
                                                                    owner,
                                                                    rider,
                                                                    user,
                                                                    email,
                                                                    msisdn:phonenumber,
                                                                    amount:body.amount,
                                                                    status:'Pending',
                                                                    dispatch:req.params.id
                                                                }) : { 
                                                                    error: "Invalid payment Body Parameters" 
                                                                };
            res.status(200).json(payment);
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log({ error })
            res.status(400).json({ error: error })
        }
    },
    update: async (req, res) => {
        const body = req.body
        let model
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            const payment = await payments.update(model, req.params.id, { status: body.status, data: body })
            res.status(200).json(payment)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log({ error })
            res.status(400).json({ error: error })
        }
    },
    paymentById: async (req, res) => {
        let { status } = req.query
        let model
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            const query = status ? [{ _id: req.params.id }, { status }] : [{ _id: req.params.id }]
            const result = await payments.findOne(model, query)
            res.status(200).json(result)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    paymentByUser: async (req, res) => {
        let model
        let { status } = req.query
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            const query = status ? [{ user: req.params.id }, { status }] : [{ user: req.params.id }]
            const result = await payments.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    paymentByRider: async (req, res) => {
        let model
        let { status } = req.query
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            const query = status ? [{ rider: req.params.id }, { status }] : [{ rider: req.params.id }]
            const result = await payments.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    paymentByOwner: async (req, res) => {
        let model
        let { status } = req.query
        try {
            model = payments.model()
        } catch (error) {
            model = payments.setModel()
        }
        try {
            const query = status ? [{ owner: req.params.id }, { status }] : [{ owner: req.params.id }]
            const result = await dispatch.find(model, query)
            res.status(200).json(result)
        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    paystackEvent: async (req, res) => {
        var hash = crypto.createHmac(
            'sha512',
            config.PAYSACK_SECRET_KEY
        ).update(JSON.stringify(req.body)).digest('hex');
        if (hash != req.headers['x-paystack-signature']) {
            // Retrieve the request's body
            var event = req.body;
            switch (event.event) {
                case "subscription.create":
                    break;
                case "invoice.create":
                    break;
                case "invoice.update":

                    break;
                case "charge.success":
                    break;
                case "transfer.success":
                    break;
                case "transfer.failed":
                    break;
                default:
                    break;
            }
        }
        return res.status(200)
    },
    confirmSuccessfulTransaction: async (req, res) => {
        try {
            const data = await payments.paystackRequest(`transaction/verify/${req.params.ref}`, 'get')
            switch (req.params.gateway) {
                case 'paystack':
                    switch (data.status) {
                        case true:
                        let model
                        try {
                            model = payments.model()
                        } catch (error) {
                            model = payments.setModel()
                        }
                        const old = await payments.findOne(model, [{ _id: req.params.ref }])
                        try {
                            old.amount*100===data.data.amount? await payments.update(model,data.data.reference, {status:'PAID'}):null
                        } catch (error) {
                            logger.info({time:new Date(),user:req.user,error})
                            console.log({ error })
                            res.status(400).json({ error: error })
                        }
                        finally{
                            old.amount===data.data.amount?  res.status(200).json({status:true}):res.status(400).json({status:false})
                        }
                        break;
                        case false:
                        res.status(400).json({status:false})
                        break;
                        default:
                        res.status(400).json({status:false})
                        break;
                    }
                    break;
                    default:
                    res.status(400).json({status:false})
                    break;
        }

        } catch (error) {
            logger.info({time:new Date(),user:req.user.id,error})
            return res.status(400).json({ msg: error.message });
        }
    }
})