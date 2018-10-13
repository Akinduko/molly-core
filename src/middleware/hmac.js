import crypto from 'crypto'
import config from '../config';
const HmacAuth = require('../utils/hmac')

export const hmac = ({ models: { apikey } }) => {
    return async (req, res, next) => {
        const { api, headers } = req
        if (!api.secretKey)
            return next()
        var auth = new HmacAuth(config.SIGNATURE_ENCRYPTION, api.secretKey, config.SIGNATURE_HEADER, [])
        req.hmac = auth
        // if (headers[config.SIGNATURE_HEADER]) 
        if ((!headers.authorization || !headers.authorization.startsWith('USK '))) { 
            return next()
        }
        // validate signature
        var authenticationResult = auth.authenticateRequest(req, req.rawBody)

        if (authenticationResult[0] != HmacAuth.MATCH) {
            return res.status(403).json({ error: 'invalid signature' })
        }
        req.service_account = true
        next()
    }
}

export default hmac