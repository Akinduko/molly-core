import { AccessControl } from 'accesscontrol';
import jwt  from 'jsonwebtoken'
import CONFIG from '../config'
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

const checkPermissions = (req) => {
    let permission
    const { baseUrl, acl, role, method } = req
    const entity = baseUrl.split('/')[3]
    // ignore permission on certain endpoints for now
    switch (entity) {
        case 'subscription':
            return null

        default:
            const roleName = role.name
            switch (method) {
                case 'GET':
                    permission = acl.can(roleName).read(entity)
                    break;
                case 'POST':
                    permission = acl.can(roleName).create(entity)
                    break;
                case 'PUT':
                    permission = acl.can(roleName).update(entity)
                    break;
                case 'DELETE':
                    permission = acl.can(roleName).delete(entity)
                    break;
                default:
                    permission = null
                    break;
            }
            return permission
    }

}


export const apiAuthMiddleware = ({ models: { roles, users ,riders,admin} }) => {
    let usermodel
    try {
        usermodel = users.model()
    } catch (error) {
        usermodel = users.setModel()
    }
    // let ridersmodel
    // try {
    //     ridersmodel = riders.model()
    // } catch (error) {
    //     ridersmodel = riders.setModel()
    // }
    return async (req, res, next) => {
    // if a service account made this request skip validating user
    if (req.service_account == true) {
        return next()
    }
    console.log('Check if request is authorized with ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        console.error('No ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer < ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    }
    jwt.verify(idToken, CONFIG.jwt_encryption, async (err, decodedIdToken) => {
        if (err) {
            console.error('Error while verifying  ID token:', err);
            res.status(403).send('Unauthorized');
        } else {
            console.log('ID Token correctly decoded')//, decodedIdToken);
            req.user = decodedIdToken;
            const operations ={users:usermodel,riders:'riders'}
            let model=''
            try { 
                for(let category in operations ){
                    if(category===req.user.category){
                        model=operations[category]
                    }
                }
                const user = await users.findOne(usermodel,[{_id:req.user.id}])
                if (user !== null && user.active !== false){
                    req.user = { ...req.user, ...user }
                let role, role_id
                // a user can have a role set to it
            
                role_id =  req.user?   req.user._doc.role:null
                console.log(role_id)
                
                try {
                    let rolemodel;
                    try {
                        rolemodel = roles.model()
                    } catch (error) {
                        rolemodel = roles.setModel()
                    }
                    role = await roles.findOne(rolemodel,[{_id:new ObjectId(role_id)}])  
                } catch (error) {
                    // if we can't get the role, then use the default free role
                    const _roles = await roles.findOne(rolemodel,[{name:"users"}])
                    if (_roles && _roles.length > 0) {
                        role = _roles[0]
                    }
                }

                try {
                    const acl = new AccessControl({ [role.name]: role.roles })
                    req.role = role
                    req.acl = acl
                } catch (error) {
                    console.log("invalid role", error)
                    return res.status(401).json({ msg: 'roles associated with user is invalid' });
                }
                const permission = checkPermissions(req)
                if (permission) {
                    if (!permission || !permission.granted) {
                        return res.status(401).json({ msg: 'user not permitted for action', permission: permission });
                    }
                }
                    return next();
                }
                else{
                    console.error('unauthorized')
                    return res.status(403).json({ error: 'unauthorized'})
                }
            } catch (error) {
                console.error('unable to retrieve user', error)
                return res.status(400).json({ error: error.message })
            } 
        }


    })

    };
} 