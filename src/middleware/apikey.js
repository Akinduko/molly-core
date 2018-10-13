import AccessKeys from '../entities/accesskeys';

const AccessControl = require('accesscontrol')
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 
/**
 * Looks for apikey inside readers and query
 *
 * @param {Object} headers  headers object
 * @param {Object} query    querystring object
 * @return {String}         the extracted api key 
 */
export const findApi = (headers, query) => {
    if (!headers) headers = {};
    if (!query) query = {};
    if (query['CustomData']) {
        const data = JSON.parse(query['CustomData'])
        if (data.api)
            return data.api
    } else if (query['CustomValue']) {
        const data = JSON.parse(query['CustomValue'])
        if (data.api)
            return data.api
    }
    return headers['x-apikey']
        || headers['x-api-key']
        || headers['x-api']
        || headers['apikey']
        || headers['api']
        || query['api-key']
        || query['apikey']
        || query['api']
}

export const apiKey = ({ models: { accesskeys, roles } }) => {
    return async (req, res, next) => {
        const key = findApi(req.headers, req.query)
        if (!key)
            return res.status(401).json({ error: 'unauthorized api key' })
        try {
            let keymodel
            try {
                keymodel = accesskeys.model()
            } catch (error) {
                keymodel = accesskeys.setModel()
            }
            const result = await accesskeys.findOne(keymodel,[{apiKey:key}])
            
            if (!result) {
                return res.status(401).json({ error: 'invalid api-key' })
            }
            req.api = result
            
            if (req.api.role) {
                try {
                let rolemodel;
                try {
                    rolemodel = roles.model()
                } catch (error) {
                    rolemodel = roles.setModel()
                }
                role = await roles.findOne(rolemodel,[{_id:new ObjectId(req.api.role)}])  
                if (role) {
                    req.api.role = role
                    try {
                        const acl = new AccessControl({ [role.name]: role.roles })
                        req.api.acl = acl
                    } catch (error) {
                        console.log("invalid apikey role", error)
                        return next()
                    }
                }
                } catch (error) {
                    console.log(`apikey role, ${req.api.role}, does not exist`)
                }
            }
        } catch (error) {
            console.log("invalid apikey role", error)
            return res.status(400).json({ error })
        }
        // console.log("apiKey:", req.api.name, "path", req.path)
        next()
    }
}

export default apiKey