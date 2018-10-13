import BaseEntity from "./base";
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'accesskeys',
    properties: {
        apiKey: {
            type: 'string'
        },
        secretKey: {
            type: 'string'
        }
    }
}
/**
 * This represents an entity
 */
export default class AccessKeys extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = 'accesskeys'
    }
    setModel = () => {
        const keySchema = new mongoose.Schema({
            description: String,
            name: String,
            apiKey: String,
            secretKey:String,
            role:String,
            created: Number,
            modified: Number
        });
        return mongoose.model('accesskeys', keySchema)
    }
    model = () => {
        return mongoose.model('accesskeys')
    }
}