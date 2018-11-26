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

export const genRefreshToken =(data)=>{
    return jwt.sign(data, 
        CONFIG.jwt_refreshTokenSecret,{});
}

export const validateToken= (idToken)=>{
    return   jwt.verify(idToken, CONFIG.jwt_refreshTokenSecret, async (err, decodedIdToken) => {
        if (err) {
            console.error('Error while verifying  ID token:', err);
            return {success:false}
        } else {
            return {success:true,id:decodedIdToken}
        }
    })
}
