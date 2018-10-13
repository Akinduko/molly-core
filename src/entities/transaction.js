import BaseEntity from "./base";

export const schema = {
    type: 'object',
    name: 'mood',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        artwork: {
            type: 'string'
        },
    }
}
/**
 * This represents an entity
 */
export default class Transaction extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = "transactions"
    }
}