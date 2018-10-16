import BaseEntity from "./base";
const Ajv = require('ajv');
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'payments',
    properties: {
        status: {
            type: "string"
        },
        dispatch: {
            type: "string"
        },
        owner: {
            type: "string"
        },
        user: {
            type: "string"
        },
        rider: {
            type: "string"
        },
        email: {
            type: "string"
        },
        amount:{
            type: "number"
        },
        msisdn:{
            type: "number"
        },
    }
}

export const createSchema = {
    type: 'object',
    name: 'payments',
    properties: {
        dispatch: {
            type: "string"
        },
        owner: {
            type: "string"
        },
        user: {
            type: "string"
        },
        rider: {
            type: "string"
        },
        email: {
            type: "string"
        },
        amount:{
            type: "number"
        },
        msisdn:{
            type: "number"
        },
    },
    additionalProperties: false,
    required: [
        'dispatch',
        'rider',
        'user',
        'owner',
        'msisdn',
        'amount',
        'email'
    ]
}

/**
 * This represents an entity
 */
export default class Payments extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = 'payments'
    }
    validateCreate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(createSchema, data)
        if (!valid){
            return false
        }
        else{
            return true
        }
    }
    setModel = () => {

        const paymentSchema = new mongoose.Schema({
            status: {
                type: String
            },
            dispatch: {
                type: String
            },
            owner: {
                type: String
            },
            user: {
                type: String
            },
            rider: {
                type: String
            },
            email: {
                type: String
            },
            amount:{
                type: Number
            },
            msisdn:{
                type: Number
            },
            created: {
                type: Number
            },
            modified: {
                type: Number
            }
        });
        return mongoose.model('payments', paymentSchema)
    }
    model = () => {
        return mongoose.model('payments')
    }
}