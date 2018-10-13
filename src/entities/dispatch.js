import BaseEntity from "./base";
const Ajv = require('ajv');
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'dispatch',
    properties: {
        cost: {
            type: 'string',
        },
        destination: {
            type: 'string',
        },
        origin: {
            type: 'string'
        },
        origingeo: {
            type: "object",
            name: "origingeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        destinationgeo: {
            type: "object",
            name: "destinationgeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        status: {
            type: 'string'
        },
        owner: {
            type: 'string',
        },
        rider: {
            type: 'string',
        },
        user: {
            type: 'string',
        },
        created: {
            type: 'string'
        },
        modified: {
            type: 'string'
        }
    }
}

export const requestSchema = {
    type: 'object',
    name: 'dispatch',
    properties: {
        destination: {
            type: 'string',
        },
        origingeo: {
            type: "object",
            name: "origingeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        destinationgeo: {
            type: "object",
            name: "destinationgeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        origin: {
            type: 'string'
        }
    },
    additionalProperties: false,
    required: [
        'origin',
        'origingeo',
        'destinationgeo',
        'destination'
    ]
}

export const userUpdateSchema = {
    type: 'object',
    name: 'dispatch',
    properties: {
        user: {
            type: 'string',
        },
        destination: {
            type: 'string',
        },
        origingeo: {
            type: "object",
            name: "origingeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        destinationgeo: {
            type: "object",
            name: "destinationgeo",
            properties: {
                lng: {
                    type: "number"
                },
                lat: {
                    type: "number"
                },
            }
        },
        origin: {
            type: 'string'
        }
    },
    additionalProperties: false,
    required: [
        'destination',
        'origin',
        'origingeo',
        'destinationgeo'

    ]
}

export const riderUpdateSchema = {
    type: 'object',
    name: 'dispatch',
    properties: {
        owner: {
            type: 'string',
        },
        rider: {
            type: 'string',
        }
    },
    additionalProperties: false,
    required: [
        'owner',
        'rider',
    ]
}

export const cancelDispatchSchema = {
    type: 'object',
    name: 'dispatch',
    properties: {
        reason: {
            type: 'string',
        }
    },
    additionalProperties: false,
    required: [
        'reason'
    ]
}
/**
 * This represents an entity
 */
export default class Dispatch extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = 'dispatch'
    }
    validateRequest = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(requestSchema, data)
        if (!valid) {
            return false
        }
        else {
            return true
        }
    }
    validateRiderUpdate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(riderUpdateSchema, data)
        if (!valid) {
            return false
        }
        else {
            return true
        }
    }

    validateCancelDispatch = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(cancelDispatchSchema, data)
        if (!valid) {
            return false
        }
        else {
            return true
        }
    }
    
    validateUserUpdate = (data) => {
        const ajv = new Ajv()
        const valid = ajv.validate(userUpdateSchema, data)
        if (!valid) {
            return false
        }
        else {
            return true
        }
    }
    setModel = () => {
        const GeoSchema = new mongoose.Schema({
            type: {
                default: "Point",
                type: String
            },
            coordinates: {
                index: "2dsphere",
                type: [Number]
            }

        });
        const dispatchSchema = new mongoose.Schema({
            cost: {
                type: String,
            },
            destination: {
                type: String,
            },
            origin: {
                type: String
            },
            origingeo: GeoSchema,
            destinationgeo: GeoSchema,
            status: {
                type: String
            },
            owner: {
                type: String,
            },
            rider: {
                type: String,
            },
            user: {
                type: String,
            },
            reasons:{
                type: String,
            },
            initiator:{
                type: String,
            },
            created: {
                type: Number
            },
            modified: {
                type: Number
            }
        });
        return mongoose.model('dispatches', dispatchSchema)
    }
    model = () => {
        return mongoose.model('dispatches')
    }
}