import BaseEntity from "./base";
const Ajv = require('ajv');
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'locations',
    properties: {
        uid: {
            type: 'string'
        },
        available:{
            type:"boolean"
        },
        geometry:{
            type:"object"
        },
        owner:{
            type: "string"
        },
        created:{
            type: "number"
        },
        modified:{
            type: "number"
        }
    }
}

export const broadcastSchema = {
    type: 'object',
    name: 'locations',
    properties: {
        available:{
            type:"boolean"
        },
        geometry:{
            type:"object"
        },
        owner:{
            type:"string"
        }
    },
    additionalProperties: false,
    required: [
        'geometry',
        'available',
        'owner'
    ]
}

export const calculateSchema = {
    type: 'object',
    name: 'locations',
    properties: {
        origin:{
            type:"object",
            name:"origin",
            properties: {
                lng:{
                    type:"number"
                },
                lat:{
                    type:"number"
                },
            }
        },
        destination:{
            type:"object",
            name:"destination",
            properties: {
                lng:{
                    type:"number"
                },
                lat:{
                    type:"number"
                },
            }
        }
    },
    additionalProperties: false,
    required: [
        'destination',
        'origin',
    ]
}

/**
 * This represents an entity
 */
export default class Locations extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = 'locations'
    }
    validateBroadcast = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(broadcastSchema, data)
        if (!valid){
            return false
        }
        else{
            return true
        }
    }
    validateCalculate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(calculateSchema, data)
        if (!valid){
            return false
        }
        else{
            return true
        }
    }
    setModel = () => {
        
        //Create GeoLocation Schema
        const GeoSchema = new mongoose.Schema({
            type: {
                default:"Point",
                type: String
            },
            coordinates:{
                index:"2dsphere",
                type: [Number]
            }

        });
        const locationSchema = new mongoose.Schema({
            available: {
                type: Boolean,
            },
            uid: {
                type: String,
            },
            geometry: GeoSchema,
            owner:{
                type: String
            },
            created: {
                type: Number
            },
            modified: {
                type: Number
            }
        });
        return mongoose.model('locations', locationSchema)
    }
    model = () => {
        return mongoose.model('locations')
    }
}