import BaseEntity from "./base";
import axios from 'axios';
import CONFIG from '../config'
const Ajv = require('ajv');
const mongoose = require('mongoose');

export const schema = {
    type: 'object',
    name: 'payments',
    properties: {
        status: {
            type: "string"
        },
        dispatch: {
            type: "string"
        },
        owner: {
            type: "string"
        },
        user: {
            type: "string"
        },
        rider: {
            type: "string"
        },
        email: {
            type: "string"
        },
        amount:{
            type: "number"
        },
        msisdn:{
            type: "number"
        },
    }
}

export const createSchema = {
    type: 'object',
    name: 'payments',
    properties: {
        amount:{
            type: "number"
        }
    },
    additionalProperties: false,
    required: [
        'amount'
    ]
}

/**
 * This represents an entity
 */
export default class Payments extends BaseEntity {
    constructor(props) {
        super(props)
        this.name = 'payments'
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
    setModel = () => {

        const paymentSchema = new mongoose.Schema({
            status: {
                type: String
            },
            dispatch: {
                type: String
            },
            owner: {
                type: String
            },
            user: {
                type: String
            },
            rider: {
                type: String
            },
            email: {
                type: String
            },
            amount:{
                type: Number
            },
            msisdn:{
                type: String
            },
            data:{
                type: Object
            },
            created: {
                type: Number
            },
            modified: {
                type: Number
            }
        });
        return mongoose.model('payments', paymentSchema)
    }
    model = () => {
        return mongoose.model('payments')
    }
    paystackRequest=async(params='',method='post',body={})=>{
        const baseUrl = 'https://api.paystack.co'
        const config= {headers:{Authorization: `Bearer ${CONFIG.PAYSTACK_SECRET_KEY}`}}
        switch(method){
            case 'get':
            try{
               const result = await axios.get(`${baseUrl}/${params}`,config);
               return result.data
            }
            catch(error){
                return error
            }
            break;
            case 'post':
            try{
                const result = await axios.post(`${baseUrl}/${params}`,body,config);
                return result.data
            }
            catch(error){
                return error
            }
            break;
            case 'put':
            try{
                const result = await axios.put(`${baseUrl}/${params}`,body,config);
                return result.data
            }
            catch(error){
                return error
            }
            break;
            case 'delete':
            try{
                const result =  await axios.delete(`${baseUrl}/${params}`,config);
                return result.data
            }
            catch(error){
                return error
            }
            break;
            default:
            try{
                const result = await axios.post(`${baseUrl}/${method}`,body);
                return result.data
            }
            catch(error){
                return error
            }
            break;
    
        }

    }
}