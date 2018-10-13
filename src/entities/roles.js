import BaseEntity from "./base";
const Ajv = require('ajv');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 


export const schema = {
    type: 'object',
    name: 'role',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string'
        },
        roles: {
            type: 'object'
        }
    },
    additionalProperties: false,
}
export const updateSchema = {
    type: 'object',
    name: 'role',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string'
        },
        roles: {
            type: 'object'
        }
    },
    
    additionalProperties: false,

}
export const createSchema = {
    type: 'object',
    name: 'role',
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string'
        },
        roles: {
            type: 'object'
        }
    },
}

/**
 * This represents an entity
 */
export default class Auths extends BaseEntity {
    constructor(props) {
        super(props)
        this.orm = props.orm
        this.name = "roles"
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

    validateUpdate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(updateSchema, data)
        if (!valid){
            return false
        }
        else{
            return true
        }
    }

    setModel = () => {
        const RoleSchema = new mongoose.Schema({
            name: String,
            description: String,
            roles: Object,
            created: {
                date: Number
            },
            modified: {
                date: Number
            }
        });
        return mongoose.model('roles', RoleSchema)
    }
    model = () => {
        return mongoose.model('roles')
    }
    objectType=()=>{
        return ObjectId  
    }
}