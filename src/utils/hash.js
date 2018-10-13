import bcrypt from 'bcrypt';
import bcrypt_p from 'bcrypt-promise';

export const  hashPassword =async()=>{
    let salt;
    salt = await (bcrypt.genSalt(10));

    //console.log(salt);
    let hash = await (bcrypt.hash(user.password, salt));
    pass = await bcrypt_p.compare(pw, this.password);
    user.password = hash;
}