import BaseEntity from "./base";
const Ajv = require('ajv')
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'riders',
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
    name: 'riders',
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
    name: 'riders',
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
    required: [
        'firstname',
        'lastname',
        'address',
        'phonenumber',
        'state',
        'email'
    ]
}


/**
 * This represents an entity
 */
export default class Riders extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = "riders"
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
    createUserRecord = (uid, data) => {
        return this.create({
            _id: uid,
            email: data.email,
            username: data.username,
            phonenumber: data.phonenumber,
            firstname: data.firstname,
            lastname: data.lastname,
            state: data.state,
            created: new Date().getTime(),
        })
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
        const UserSchema = new mongoose.Schema({
            _id: String,
            username: String,
            firstname: String,
            lastname: String,
            address: String,
            phonenumber: String,
            role: String,
            state: String,
            active:Boolean,
            email: String,
            avatar:String,
            status:String,
            owner:String,
            created: {
                type: Number
            },
            updated: {
                type: Number
            }
        });
        return mongoose.model('riders', UserSchema)
    }
    setModel = () => {
        return mongoose.model('riders')
    }


}