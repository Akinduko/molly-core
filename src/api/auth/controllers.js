import { genIdToken,genRefreshToken ,validateToken} from '../../utils/generateidtoken'
import { sendMail } from '../../utils/email'
const logger = require('../../utils/logger').logger;

const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random() * 0x100000)).toString(16).substring(1)
    }
    return s4() + s4() + s4()
}
export default ({ entities: { auths, users, roles } }) => ({
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
                body['category'] = 'users'
                let { created, active, passcode, pending_validation, email } = body
                const check_auth = await auths.findOne(authmodel, [{ email }]);
                check_auth ? await auths.update(authmodel, check_auth._id,{ 
                     passcode 
                    }):{}
                const auth = check_auth?check_auth:await auths.create(authmodel, { created, active, passcode, pending_validation, email });
                const html = `<body><strong>Activate Your Account</strong>
                <p>Passcode:${passcode}</p><p href="adenison.com">Click here to activate<p></body>`
                const emails = auth.code && auth.code === 11000 ? null : auth._id && auth.email ?
                    await sendMail("no-reply@adenison.ng", email, "Activate Your Account", html) : null;
                console.log(emails)
                logger.info({ time: new Date(), error: emails })
                emails === true ? null : await auths.delete(authmodel, { email });
                auth.code && auth.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }) :
                    emails === true ? res.status(200).json({ success: true, id: auth._id }) :
                        res.status(400).json({ success: false, error: 'Account creation failed' });
            }
            catch (error) {
                logger.info({ time: new Date(), error })
                console.log(error)
                error.err.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }) : res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            logger.info({ time: new Date(), error })
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
                let { passcode, password } = body
                const auth = await auths.findOne(authmodel, [{ email: body['email'] }]);
                if (passcode === auth['passcode'] && auth['pending_validation'] !== true) {
                    res.status(200).json({ success: true, message: 'Validation is not pending', id: auth['_id'] });
                }
                else if (passcode === auth['passcode'] && auth['pending_validation'] === true) {
                    auth['modified'] = Date.now();
                    // auth['active'] = true;
                    auth['pending_validation'] = false;
                    const { modify, pending_validation } = auth
                    const update = password && password.split('').length > 0 ?
                        await auths.update(authmodel, auth._id, { modify, pending_validation, passcode: guid(), password }) :
                        await auths.update(authmodel, auth._id, { modify, pending_validation });
                    update.nModified === 1 ? res.status(200).json({ success: true, id: auth['_id'] }) :
                        res.status(400).json({ error: 'Validation Failed' });

                }
                else {
                    console.log(auth)
                    res.status(400).json({ error: "Invalid Auth Parameters" })
                }
            }
            catch (error) {
                console.log(error)
                logger.info({ time: new Date(), error })
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            logger.info({ time: new Date(), error })
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
                const emails = auth.nModified === 1 && authd._id && authd.email ? await sendMail("no-reply@adenison.com.ng", email, "Reset Your Password", html) : null
                logger.info({ time: new Date(), error: emails })
                auth.nModified === 1 ? res.status(200).json({ success: true, id: authd['_id'] }) : res.status(400).json({ success: false, error: 'Password reset failed' })
            }
            catch (error) {
                logger.info({ time: new Date(), error })
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
        }
        catch (error) {
            logger.info({ time: new Date(), error })
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
        const authbody = {}
        const userbody = {}
        try {
            const { email, password } = req.body
            const authd = await auths.findOne(authmodel, [{ email }]);
            if (authd && authd.active !== true) {
                const validateuser = await users.validateSignup(req.body)
                if (validateuser) {
                    authbody['modified'] = Date.now()
                    authbody['active'] = true;
                    authbody['created'] = Date.now()
                    const auth = validateuser ?
                        await auths.update(authmodel, authd._id, { ...authbody, ...{ password } }) : {};
                    let rolemodel;
                    try {
                        rolemodel = roles.model()
                    } catch (error) {
                        rolemodel = roles.setModel()
                    }
                    let query = {}
                    query[`name`] = 'users'
                    const role = await roles.findOne(rolemodel, [query])
                    const idtoken = validateuser && auth.nModified === 1 ? await genIdToken({ id: auth._id, category: 'users' }) : {}
                    userbody['_id'] = authd._id;
                    userbody['email'] = authd.email;
                    userbody['role'] = role._id;
                    console.log({_id:role._id,id:role.id})
                    userbody['active'] = true;
                    userbody['business'] = userbody['business'] ? userbody['business'] : false;
                    const user = validateuser && auth.nModified === 1 ?
                        await users.create(usersmodel, { ...req.body, ...userbody }) : {};
                    console.log(user)
                    const html = '<strong>Welcome</strong>'
                    auth.code === 11000 ? null : validateuser && auth.nModified === 1 && user.email ?
                        await sendMail("no-reply@adenison.ng", userbody.email, "Welcome to Adenison", html) : null;
                    auth.code === 11000 ? res.status(400).json({ error: 'Email is already registered' }) :
                        res.status(200).json({ user, idtoken });

                }
                else {
                    res.status(400).json({ error: "Invalid User Body Parameters" })
                }
            }
            else {
                if (authd.active === true) {
                    logger.info({ time: new Date(), error: "Account already Exists" })
                    res.status(400).json({ error: "Account already Exists" })
                }
                else {
                    logger.info({ time: new Date(), error: "Invalid Auth Parameters" })
                    res.status(400).json({ error: "Invalid Auth Parameters" })
                }
            }
        }
        catch (error) {
            logger.info({ time: new Date(), error })
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
                logger.info({ time: new Date(), error })
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
            const auth = await auths.login(authmodel, body)
            const idtoken = auth != null ? await genIdToken({ id: auth._id, category: 'users' }) : null
            const refreshToken = auth != null ? await genRefreshToken({ id: auth._id, category: 'users' }) : null
            auth != null ? res.status(200).json({ success: idtoken ,refreshToken}) : res.status(403).json({ failed: "Unauthorized" })
        }
        catch (error) {
            logger.info({ time: new Date(), error })
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    refresh: async (req, res) => {
        try {
            const {token}=req.query
            const validate = await validateToken(token) 
            const uid= validate.success===true ? validate.id:null
            const generated = validate.success===true ?  await genIdToken({ id: uid, category: 'users' }) : null
            generated != null ? res.status(200).json({ token: generated }) : res.status(403).json({ failed: "Unauthorized" })
        }
        catch (error) {
            logger.info({ time: new Date(), error })
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
                logger.info({ time: new Date(), error })
                res.status(400).json({ error: "Invalid Auth Body Parameters" })
            }
            const auth = await auths.login(authmodel, body)
            const idtoken = auth != null ? await genIdToken(auth._id, auth.email) : null
            auth != null ? res.status(200).json({ success: idtoken }) : res.status(403).json({ failed: "Unauthorized" })
        }
        catch (error) {
            logger.info({ time: new Date(), error })
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    }
})