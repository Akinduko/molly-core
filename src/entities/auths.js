import BaseEntity from "./base";
const Ajv = require('ajv');
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'auths',
    properties: {
        email: {
            type: 'string',
            minLength: 5
        },
        password: {
            type: 'string',
            minLength: 8
        },
        passcode:  {
            type: 'number'
        },
        pending_validation:  {
            type: 'boolean'
        },
        active:  {
            type: 'boolean'
        },
        created: {
            type:'number'
        },
        modified: {
            type:'number'
        }
    },
    additionalProperties: false,
}
export const updateschema = {
    type: 'object',
    name: 'auths',
    properties: {
        email: {
            type: 'string',
            minLength: 5
        },
        password: {
            type: 'string',
            minLength: 8
        }
    },
    
    additionalProperties: false,
    required: [
        'email',
        'password'
    ]
}
export const signupSchema = {
    type: 'object',
    name: 'auths',
    properties: {
        email: {
            type: 'string',
            minLength: 5
        },
        password: {
            type: 'string',
            minLength: 8
        },
        passcode:{
            type: 'string',
            minLength:4
        }
    },
    additionalProperties: false,
    required: [
        'email',
        'password',
        'passcode'
    ]
}

export const loginSchema = {
    type: 'object',
    name: 'auths',
    properties: {
        email: {
            type: 'string',
            minLength: 5
        },
        password: {
            type: 'string',
            minLength: 8
        }
    },
    additionalProperties: false,
    required: [
        'email',
        'password'
    ]
}
/**
 * This represents an entity
 */
export default class Auths extends BaseEntity {
    constructor(props) {
        super(props)
        this.orm = props.orm
        this.name = "auths"
    }
    validateSignup = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(signupSchema, data)
        if (!valid){
            return false
        }
        else{
            return true
        }
    }

    validateLogin = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(loginSchema, data)
        if (!valid)
        return false
        return true
    }

    createAuthRecord = ( data) => {
        return this.create({
            email: data.email,
            password:data.password,
            created: new Date().getTime(),
        })
    }

    updateAuthRecord = (data) => {
        return this.create({
            email: data.email,
            password:data.password,
            modified: new Date().getTime(),
        })
    }

    validate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(schema, data)
        if (!valid)
        return false
        return true
    }

    validateUpdate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(updateschema, data)
        if (!valid)
        return false
        return true
    }
    
    setModel = () => {
        const AuthSchema = new mongoose.Schema({
            password: String,
            email: String,
            passcode: String,
            pending_validation: Boolean,
            active: Boolean,
            created: Number,
            category:String,
            modified: Number,
        });
        return mongoose.model('auths', AuthSchema)
    }
    model = () => {
        return mongoose.model('auths')
    }
}