import BaseEntity from "./base";
const Ajv = require('ajv')
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'partners',
    properties: {
        firstname: {
            type: 'string',
            minLength: 5
        },
        lastname: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        phonenumber: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        avatar: {
            type: 'string'
        }
    },
    additionalProperties: false
}

export const updateschema = {
    type: 'object',
    name: 'partners',
    properties: {
        firstname: {
            type: 'string',
            minLength: 5
        },
        lastname: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        phonenumber: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        avatar: {
            type: 'string'
        }

    },
    additionalProperties: false
}

const paymentSchema =   { 
type: 'object',
name: 'partners',
properties: {
    business_name: {
        type: 'string'
    },
    settlement_bank:{
        type: 'string'
    },
    account_number:{
        type: 'string'
    },
    percentage_charge:{
        type: 'string'
    }
},
additionalProperties: false
};

export const signupSchema = {
    type: 'object',
    name: 'partners',
    properties: {
        name: {
            type: 'string',
            minLength: 5
        },
        email: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        phonenumber: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        company: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
        payment:paymentSchema
    },
    required: [
        'name',
        'email',
        'address',
        'phonenumber',
        'state',
        'payment'
    ]
}


/**
 * This represents an entity
 */
export default class Partners extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = "partners"
    }
    validateCreate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(signupSchema, data)
        if (!valid) {
            return false
        }
        else {
            return true
        }
    }
    validate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(schema, data)
        if (!valid)
            throw ajv.errors
        return true
    }
    validateUpdate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(updateschema, data)
        if (!valid)
            throw ajv.errors
        return true
    }
    model = () => {
        const PaymentSchema = new mongoose.Schema({
            business_name: {
                type: String
            },
            settlement_bank:{
                type: String
            },
            account_number:{
                type: String
            },
            percentage_charge:{
                type: Number
            }
        });
        
        const partnerSchema = new mongoose.Schema({
            name: String,
            address: String,
            phonenumber: String,
            state: String,
            active:Boolean,
            email: String,
            avatar:String,
            status:String,
            company:String,
            country:String,
            payment:PaymentSchema,
            created: {
                type: Number
            },
            updated: {
                type: Number
            }
        });
       
        return mongoose.model('partners', partnerSchema)
    }
    setModel = () => {
        return mongoose.model('partners')
    }


}