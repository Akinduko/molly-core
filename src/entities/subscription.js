import BaseEntity from "./base";
const Ajv = require('ajv')

export const schema = {
    type: 'object',
    name: 'subscription',
    properties: {
        plan: {
            type: 'string'
        },
        owner: {
            type: 'string'
        },
        status: {
            type: 'string',
            enum: ['PENDING', 'ACTIVE']
        }
    },
    required: [
        'plan',
        'owner',
        'status'
    ]
}
/**
 * This represents an entity
 */
export default class Subscription extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = "subscriptions"
    }
    validate(data) {
        const ajv = new Ajv()
        const valid = ajv.validate(schema, data)
        if (!valid)
            throw ajv.errors
        return true
    }
    // create(data) {
    //     const ajv = new Ajv()
    //     const valid = ajv.validate(schema, data)
    //     if (!valid)
    //         throw ajv.errors
    //     super.create(data)
    // }
}