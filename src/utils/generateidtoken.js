import  jwt from 'jsonwebtoken';
import CONFIG from '../config'

export const genIdToken =(data)=>{
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer " + jwt.sign(data, 
        CONFIG.jwt_encryption,
        {
            expiresIn: expiration_time
        });
}
