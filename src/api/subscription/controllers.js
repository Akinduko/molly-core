import { makeSecureToken } from "../../utils/secure";
import config from '../../config';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

function fancyDate(input = new Date()) {
    var input = new Date(input)
    let date = ''
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var monthName = monthNames[input.getMonth()]
    var day = input.getDate()

    if (day > 3 && day < 21) {
        date = day + "th"
    } else {
        switch (day % 10) {
            case 1:
                date = day + "st"
                break;
            case 2:
                date = day + "nd"
                break;
            case 3:
                date = day + "rd"
                break;
            default:
                date = day + "th"
                break;
        }
    }

    var year = input.getFullYear()
    return monthName + " " + date + ", " + year
}
export default class Controller {
    constructor({ entities, indexers, paystack }) {
        this.entities = entities
        this.indexers = indexers
        this.paystack = paystack
    }
    getPaymentsCredentials = async ({ apikey, req }) => {
        let paymentsCredentials
        try {
            // get udux payments api key
            const result = await apikey.getAll({
                size: '1',
                "where": [
                    ["name", "==", "payments.udux"]
                ]
            })
            if (result.length === 0) {
                return res.status(401).json({ error: 'payments have not been enabled' })
            }
            paymentsCredentials = result[0]
        } catch (error) {
            throw error
        }
        return paymentsCredentials
    }
    generateSecureToken = ({ paymentsCredentials, subscription, user, plan }) => {
        return makeSecureToken(paymentsCredentials.secretKey, {
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            subscription: subscription.id, user: user.id, email: user.email,
            ...(plan ? {
                description: plan.description, amount: plan.amount, code: plan.paystackPlan, plan: plan.id, name: plan.name
            } : {}),

        })
    }
    getSubscription = async (req) => {
        const { apikey, subscriptions } = this.entities
        let paymentCredentials, data, _subscription
        try {
            paymentCredentials = await this.getPaymentsCredentials({ apikey, req })
        } catch (error) {
            throw error
        }
        if (req.query && req.query.token) {
            try {
                const decoded = jwt.verify(req.query.token, paymentCredentials.secretKey);
                data = { ...data, ...decoded }
            } catch (error) {
                throw error
            }
            try {
                _subscription = await subscriptions.get(data.subscription)
            } catch (error) {
                throw error
            }

            if (_subscription.status == 'CANCELLED') {
                // cancel subscription from payment gateway as well?
                throw new Error(`subscription has been cancelled`);
            }
            /** validate and return subscription from payment gateway */
            try {
                let result
                result = await this.paystack.customer.get(data.email)
                if (result.status && result.data.subscriptions.length > 0) {
                    console.log(result)
                    const customer = result.data
                    // check if subscription exists  
                    let subscription
                    subscription = customer.subscriptions[customer.subscriptions.length - 1]
                    result = await this.paystack.subscription.get(subscription.id)
                    if (!result.status) {
                        throw new Error("invalid subscription")
                    }
                    subscription = result.data

                    // does this plan exist
                    const result2 = await this.paystack.plan.get(subscription.plan.id)
                    if (!result2.status) {
                        throw new Error("invalid subscription plan")
                    }

                    // plan is already active but subscription at gateway is complete/canceleld
                    if (subscription.status == 'active') {
                        if (_subscription.plan == "") {
                            const plan = await plans.getAll({ where: [["name", "==", subscription.plan.name]] })
                            const newSub = await subscriptions.update(_subscription.id, { plan: plan.id, planName: plan.name, status: 'ACTIVE' })
                            _subscription = { ..._subscription, ...newSub }
                        }
                    } else if (subscription.status == 'complete') {
                        const newSub = await subscriptions.update(_subscription.id, { status: 'CANCELLED' })
                        _subscription = { ..._subscription, ...newSub }
                        throw new Error(`subscription is complete`);
                    }
                    //plan exists
                    const plan = result2.data
                    // subscription at gateway is active 
                    if (subscription.status == 'active') {
                        if (plan.plan_code == data.code) {
                            const next_payment = Date.parse(subscription.next_payment_date)
                            _subscription.next_payment = next_payment
                            _subscription.amount = plan.amount
                            _subscription.interval = plan.interval
                        }
                    }
                }
            } catch (error) {
                throw error
            }
            // end
            return { data, subscription: _subscription };
        }
        throw new Error("invalid token was passed");
    }
    subscribe = async (req, res) => {
        const { subscriptions, users, plans, apikey } = this.entities
        let paymentsCredentials
        try {
            // get udux payments api key
            const result = await apikey.getAll({
                size: '1',
                "where": [
                    ["name", "==", "payments.udux"]
                ]
            })
            if (result.length === 0) {
                return res.status(401).json({ error: 'payments have not been enabled' })
            }
            paymentsCredentials = result[0]
        } catch (error) {
            return res.status(400).json({ error })
        }
        let user, subscription, plan
        // try {
        //     plan = await plans.get(req.body.plan)
        // } catch (error) {
        //     return res.status(400).json({ msg: 'plan does not exist', error: error.message })
        // }
        // try {
        //     user = await users.get(req.user.user_id)
        // } catch (error) {
        //     return res.status(400).json({ error: error.message })
        // }
        user = req.user
        try {
            const result = await subscriptions.getAll({ where: [['owner', '==', req.user.user_id]], size: 1 })
            if (result && result.length > 0) {
                subscription = result[0]
                // if subscription is active
                if (subscription.status != 'CANCELLED') {
                    const securetoken = this.generateSecureToken({ paymentsCredentials, subscription, user, plan })
                    return res.status(200).json({ subscription, securetoken })
                }
                // }
            }

        } catch (error) {
            console.log(error)
        }
        try {
            const data = { owner: user.id, plan: "", status: 'PENDING' }
            subscriptions.validate(data)
            subscription = await subscriptions.create(data)
        } catch (error) {
            return res.status(400).json({ msg: 'unable to create subscribtion', error: error.message ? error.message : error })
        }
        // secure token is passed to the payments app for further pricing
        const securetoken = this.generateSecureToken({ paymentsCredentials, subscription, user, plan })
        return res.status(201).json({ subscription, securetoken })
    }
    verifySubscriptionToken = async (req, res) => {
        try {
            const { data, subscription } = await this.getSubscription(req)
            if (subscription.next_payment > new Date()) {
                return res.status(200).json({ msg: `subscription is already active till ${fancyDate(subscription.next_payment)}`, subscription, data });
            }
            if (subscription.active == 'ACTIVE') {
                return res.status(400).json({ msg: "subscription is already active", subscription, data });
            }
            return res.status(200).json({ ...data, subscription })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ msg: error.message });
        }
    }
    /**
     * Confirms that a transaction was actually made and hence a subscription can be moved from pending
     */
    confirmSuccessfulTransaction = async (req, res) => {
        const { subscriptions, transactions } = this.entities
        let subscription, data

        try {
            data = await this.getSubscription(req)
            subscription = data.subscription
        } catch (error) {
            return res.status(400).json({ msg: error.message });
        }
        if (subscription.status == 'PENDING') {
            let transaction
            try {
                const result = await this.paystack.transaction.verify(req.params.ref)
                if (result.status == true && result.data.status == 'success') {
                    transaction = await transactions.create({
                        ...result.data,
                        transaction_id: result.data.id,
                        subscription: subscription.id,
                        gateway: req.params.gateway
                    })
                } else {
                    return res.status(400).json({ msg: result.message })
                }
            } catch (error) {
                return res.status(400).json({ msg: error.message })
            }
            try {
                const updated = await subscriptions.update(subscription.id, { status: 'ACTIVE' })
                return res.status(201).json({ subscription: updated, transaction })
            } catch (error) {
                return res.status(400).json({ msg: error.message })
            }
        }
    }
    paystackEvent = async (req, res) => {
        var hash = crypto.createHmac(
            'sha512',
            config.PAYSACK_SECRET_KEY
        ).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
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
    }
    unsubscribe = async (req, res) => {
        let subscription, transaction
        try {
            const result = await this.getSubscription(req)
            subscription = result.subscription
        } catch (error) {
            console.log(error)
            return res.status(400).json({ msg: 'unable to get current subscription', error: error.message })
        }

        try {
            const results = await transactions.getAll({
                where: [[
                    "subscription", "==", subscription.id
                ]],
                order: 'desc',
                order_field: 'created'
            })
            if (results && results.length > 0) {
                transaction = results[0]
            }
        } catch (error) {
            return res.status(400).json({ msg: 'unable to get current transaction', error: error.message })
        }
        switch (transaction.gateway) {
            case 'paystack':
                const result = await this.paystack.customer.get(req.user.email)
                if (result.status) {
                    const customer = result.data
                    let paystackSubscription
                    paystackSubscription = customer.subscriptions[customer.subscriptions.length - 1]
                    result = await this.paystack.subscription.get(subscription.id)
                    if (!result.status) {
                        throw new Error("invalid subscription")
                    }
                    paystackSubscription = result.data
                    if (subscription.status == 'active') {
                        const { email_token, subscription_code } = paystackSubscription
                        try {
                            const result = await this.paystack.customer.disable({ email_token, subscription_code })
                            if (!result.status) {
                                return res.status(400).json({ msg: result.message })
                            }
                        } catch (error) {
                            console.log('unable to disable subscription', error)
                            return res.status(400).json({ msg: 'unable to disable subscription' })
                        }
                        try {
                            await subscriptions.update(subscription.id, { status: 'CANCELLED' })
                            return res.status(200).json({ msg: "subscription cancelled", subscription: subscription.id })
                        } catch (error) {
                            return res.status(400).json({ msg: 'unable to unsubscribe', error: error.message })
                        }
                    } else {
                        return res.status(400).json({ msg: 'subscription is already inactive' })
                    }
                } else {
                    return res.status(400).json({ msg: result.message })
                }
            default:
                break;
        }
        return res.status(400).json({ msg: 'unsupported gateway' })

    }
    subscription = async (req, res) => {
    }
}