import { genIdToken } from '../../utils/generateidtoken'
import { sendMail } from '../../utils/email'

const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random() * 0x100000)).toString(16).substring(1)
    }
    return s4()+s4()+s4()
}
export default ({ entities: { auths, users,roles }, logger }) => ({
    create: async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model();
            } catch (error) {
                authmodel = auths.setModel();
            }
            const body = req.body;
            try {
                body['created'] = Date.now();
                body['active'] = false;
                body['passcode'] = guid();
                body['pending_validation'] = true;
                body['category']='users'
                let { created, active, passcode, pending_validation, email } = body
                const auth = await auths.create(authmodel, { created, active, passcode, pending_validation, email });
                const html = `<body><strong>Activate Your Account</strong>
                <p>Passcode:${passcode}</p><p href="adenison.com">Click here to activate<p></body>`
                const emails = auth.code&& auth.code === 11000 ? null : auth._id && auth.email ? 
                await sendMail("no-reply@adenison.com.ng", email, "Activate Your Account", html) : null;
                console.log(emails)
                emails===true?null:await auths.delete(authmodel, { email });
                auth.code && auth.code === 11000  ? res.status(400).json({ error: 'Email is already registered' }) : 
                emails===true? res.status(200).json({ success:true, id:auth._id }):
                res.status(400).json({ success:false,error: 'Account creation failed' });
            }
            catch (error) {
                console.log(error)
                error.err.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }):res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    validate: async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model();
            } catch (error) {
                authmodel = auths.setModel();
            }
            const body = req.body;
            try {
                let { passcode,password } = body
                const auth = await auths.findOne(authmodel, [{ email: body['email'] }]);
                if (passcode === auth['passcode'] && auth['pending_validation'] === true) {
                    auth['modify'] = Date.now();
                    // auth['active'] = true;
                    auth['pending_validation'] = false;
                    let {modify,pending_validation}=auth
                    const update = password &&password.split('').length>0?
                    await auths.update(authmodel, auth._id, {modify,pending_validation,passcode:guid(),password}):
                    await auths.update(authmodel, auth._id, {modify,pending_validation});
                    update.nModified===1 ? res.status(200).json({ success:true, id:auth['_id']}):
                    res.status(400).json({ error: 'Validation Failed' });

                }
                else {
                    res.status(400).json({ error: "Invalid Auth Parameters" })
                }
            }
            catch (error) {
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    resetpassword: async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model();
            } catch (error) {
                authmodel = auths.setModel();
            }

            try {
                let { email } = req.body
                const authd = await auths.findOne(authmodel, [{ email }]);
                const body = req.body;
                body['modify'] = Date.now();
                body['pending_validation'] = true;
                body['passcode'] = guid();
                let { modify, pending_validation, passcode } = body
                const auth = await auths.update(authmodel, authd._id, { modify, pending_validation, passcode });
                const html = `<body><strong>Reset Your Password</strong>
                <p>Passcode:${passcode}</p><p href="adenison.com">Click here to activate<p></body>`
                const emails = auth.nModified===1&& authd._id && authd.email ? await sendMail("no-reply@adenison.com.ng", email, "Reset Your Password", html) : null
                auth.nModified===1? res.status(200).json({ success: true, id: authd['_id'] }):res.status(400).json({success:false,error:'Password reset failed'})
            }
            catch (error) {
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    signup: async (req, res) => {
        let authmodel, usersmodel;
        try {
            authmodel = auths.model()
        } catch (error) {
            authmodel = auths.setModel()
        }
        try {
            usersmodel = users.model()
        } catch (error) {
            usersmodel = users.setModel()
        }
        const authbody = req.body.auth
        const userbody = req.body.user
        try {
            let { passcode,email,password } = req.body.auth
            const authd = await auths.findOne(authmodel, [{ email}]);
            if(authd && passcode===authd.passcode && authd.active!==true){
                const validateuser = await users.validateSignup(userbody)
                const validateauth = await auths.validateSignup(authbody)
                validateuser ? null : res.status(400).json({ error: "Invalid User Body Parameters" })
                validateauth ? null : res.status(400).json({ error: "Invalid Auth Body Parameters" })
                authbody['modified'] = Date.now()
                authbody['passcode'] = guid();
                authbody['active'] = true;
                userbody['created'] = Date.now()
                let {modified,passcode,active} =authbody
                const auth = validateuser && validateauth ?
                 await auths.update(authmodel,authd._id, {password,modified,passcode,active}) : {};
                 let rolemodel;
                 try {
                     rolemodel = roles.model()
                 } catch (error) {
                     rolemodel = roles.setModel()
                 }
                 let query={}
                 query[`name`] = 'users'
                const role = await roles.findOne(rolemodel, [query])
                const idtoken = validateuser && validateauth && auth.nModified===1 ? await genIdToken(authd._id) : {}
                userbody['_id'] = authd._id;
                userbody['email'] = authd.email;
                userbody['role'] = role;
                userbody['active'] = true;
                userbody['business'] = userbody['business']?userbody['business']:false;
                const user = validateuser && validateauth && auth.nModified===1 ? 
                await users.create(usersmodel, userbody) : {};
                const html = '<strong>Welcome</strong>'
                auth.code === 11000 ? null : validateuser && validateauth && auth.nModified===1 && user.email ?
                 await sendMail("no-reply@adenison.com.ng", userbody.email, "Activate Your Account", html) : null;
                auth.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }) :
                 res.status(200).json({ user, idtoken });
            }
            else {
                if(authd.active===true){
                    res.status(400).json({ error: "Account already Exists" })
                }
                else{
                    res.status(400).json({ error: "Invalid Auth Parameters" })
                }  
            }
        }
        catch (error) {
            console.log({ error })
            error.err.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }) : res.status(400).json({ error: error })
        }
    },
    login: async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model()
            } catch (error) {
                authmodel = auths.setModel()
            }

            const body = req.body
            try {
                await auths.validateLogin(body)
            }
            catch (error) {
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
            const auth = await auths.login(authmodel, body)
            const idtoken = auth != null ? await genIdToken({id:auth._id,category:'users'}) : null
            auth != null ? res.status(200).json({ success: idtoken }) : res.status(403).json({ failed: "Unauthorized" })
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model()
            } catch (error) {
                authmodel = auths.setModel()
            }

            const body = req.body
            try {
                await auths.validateLogin(body)
            }
            catch (error) {
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
            const auth = await auths.login(authmodel, body)
            const idtoken = auth != null ? await genIdToken(auth._id, auth.email) : null
            auth != null ? res.status(200).json({ success: idtoken }) : res.status(403).json({ failed: "Unauthorized" })
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    }
})