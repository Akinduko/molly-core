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
        }
    },
    required: [
        'name',
        'email',
        'address',
        'phonenumber',
        'state'
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