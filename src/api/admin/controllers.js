// import { genIdToken } from '../../utils/generateidtoken'
import { sendMail } from '../../utils/email'
var ObjectId = require('mongoose').Types.ObjectId; 

const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random() * 0x100000)).toString(16).substring(1)
    }
    return s4()+s4()+s4()+s4()+s4()+s4()
}
export default ({ entities: { roles ,riders,partners,accesskeys,auths} }) => ({
    createRoles: async (req, res) => {
        let rolemodel;
        try {
            rolemodel = roles.model()
        } catch (error) {
            rolemodel = roles.setModel()
        }

        const rolebody = req.body
        try {
            const validaterole = await roles.validateCreate(rolebody)
            rolebody['created'] = Date.now()
            const role = validaterole ? await roles.create(rolemodel, rolebody) : {}
            validaterole ? res.status(200).json(role) : res.status(400).json({ error: "Invalid Roles Body Parameters" })
           
        }
        catch (error) {
            console.log({ error })
            res.status(400).json({ error: error })
        }
    },
    getRoles: async (req, res) => {
        try {
            let rolemodel;
            try {
                rolemodel = roles.model()
            } catch (error) {
                rolemodel = roles.setModel()
            }
            const {  where , size}=req.query
            let whereQ= where ? JSON.parse(where):[]
            let query=[];
            
            for(let each of whereQ){
                    let subquery={}
                    subquery[`${each.split('==')[0]}`] = `${each.split('==')[1]}`
                    query.push(subquery) 
                }
            if(query.length>0){
                const result = await roles.findOne(rolemodel, query)
                res.status(200).json(result)
            }
            else{
                const result = await roles.getAll(rolemodel)
                res.status(200).json(result)
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    getRoleById: async (req, res) => {
        try {
            let rolemodel;
            try {
                rolemodel = roles.model()
            } catch (error) {
                rolemodel = roles.setModel()
            }
            let query={}
            query[`_id`] = req.params.id
            const result = await roles.findOne(rolemodel, [query])
            res.status(200).json(result)
        }
        catch (error) {
            res.status(400).json({ error: error.err.message })
            
        }
    },
    grantRoleById: async (req, res) => {
        try {
            let rolemodel;
            try {
                rolemodel = roles.model()
            } catch (error) {
                rolemodel = roles.setModel()
            }
            const data = req.body
            const output = await roles.findOne(rolemodel,[{_id:new ObjectId(req.params.id)}])
            const previous = output.roles
            const key = Object.keys(data);
            const values =Object.values(data)
            for (let i=0;i<key.length;i++){
                previous[key[i]]=values[i]
            }
            output[roles]=previous
            output['modified'] = Date.now()
            const role =  await roles.update(rolemodel,req.params.id, output) 
            res.status(200).json(role)
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.err.message })
            
        }
    },
    revokeRoleById: async (req, res) => {
        try {
            let rolemodel;
            try {
                rolemodel = roles.model()
            } catch (error) {
                rolemodel = roles.setModel()
            }
            const data = req.body.roles
            const output = await roles.findOne(rolemodel,[{_id:new ObjectId(req.params.id)}])
            const previous = output.roles
            for (let i=0;i<data.length;i++){
                delete previous[data[i]]
            }
            output[roles]=previous
            output['modified'] = Date.now()
            const role = await roles.update(rolemodel,req.params.id, output)
            res.status(200).json(role)
        }
        catch (error) {
            console.log(error)
            res.status(400).json({ error: error.err.message })
            
        }
    },
    getPendingRiders:async (req, res) => {
        try {
            let ridersmodel;
            try {
                ridersmodel = riders.model()
            } catch (error) {
                ridersmodel = riders.setModel()
            }
            let query={}
            query[`status`] = 'pending'
            const result = await riders.find(ridersmodel, [query])
            res.status(200).json(result)
        }
        catch (error) {
            res.status(400).json({ error: error.err.message })
            
        }
    },
    getPendingPartners:async (req, res) => {
        try {
            let partnersmodel;
            try {
                partnersmodel = partners.model()
            } catch (error) {
                partnersmodel = partners.setModel()
            }
            let query={}
            query[`status`] = 'pending'
            const result = await partners.find(partnersmodel, [query])
            res.status(200).json(result)
        }
        catch (error) {
            console.log({error})
            res.status(400).json({ error: error })
            
        }
    },
    grantPendingPartner:async (req, res) => {
        try {
            let accesssmodel;
            try {
                accesssmodel = accesskeys.model()
            } catch (error) {
                accesssmodel = accesskeys.setModel()
            }
            let key={}
            key[`_id`] = req.params.id
            const keys = await accesskeys.findOne(accesssmodel, [key])
            if(keys&&keys.id){
                res.status(400).json({ error: 'Partner Already Exist' })
            }
            else{
                let partnersmodel;
                try {
                    partnersmodel = partners.model()
                } catch (error) {
                    partnersmodel = partners.setModel()
                }            
                let query={}
                query[`_id`] = req.params.id
                const result = await partners.findOne(partnersmodel, [query])
                result['status']='verified'
                result['active']=true
                delete result['_id']
                await partners.update(partnersmodel,req.params.id, result)
                let rolemodel;
                try {
                    rolemodel = roles.model()
                } catch (error) {
                    rolemodel = roles.setModel()
                }
                let input={}
                input[`name`] = 'partners'
                const role = await roles.findOne(rolemodel, [input])
                const data ={}
                data['secretKey']=guid();
                data['apiKey']=guid();
                data['name']=result.name;
                data['_id']=req.params.id;
                data['role']=role._id;
                const outcome = await accesskeys.create(accesssmodel,data)
                if(outcome.id){
                    const html = `<body><strong>Welcome to Adenison Logistics</strong>
                    <p>Dear ${outcome.name}, your partner account has been created</p>
                    <p>apiKey:${outcome.apiKey}</p>
                    <p>secretKey:${outcome.secretKey}</p>
                    <p>Please Keep this credentials confidential<p></body>`
                    await sendMail("no-reply@adenison.com.ng", result.email, "Welcome to Adenison Logistics", html);
                }                
                res.status(200).json(outcome)   
            }
        }
        catch (error) {
            console.log({error})
            res.status(400).json({ error: error })    
        }
    },
    grantPendingRider:async (req, res) => {
        try {
            let authmodel;
            try {
                authmodel = auths.model()
            } catch (error) {
                authmodel = auths.setModel()
            }
            let key={}
            key[`_id`] = req.params.id
            const auth = await auths.findOne(authmodel, [key])
            if(auth&&auth.active===true){
                res.status(400).json({ error: 'Partner Already Exist' })
            }
            else{
                let rolemodel;
                try {
                    rolemodel = roles.model()
                } catch (error) {
                    rolemodel = roles.setModel()
                }
                let input={}
                input[`name`] = 'riders'
                const role = await roles.findOne(rolemodel, [input])
                let ridersmodel;
                try {
                    ridersmodel = riders.model()
                } catch (error) {
                    ridersmodel = riders.setModel()
                }            
                let query={}
                query[`_id`] = req.params.id
                const result = await riders.findOne(ridersmodel, [query])
                result['status']='verified'
                result['role']=role.id
                delete result['_id']
                await riders.update(ridersmodel,req.params.id, result)
                const body=new Object()
                body['modified'] = Date.now();
                body['active'] = false;
                body['passcode'] = guid();
                body['pending_validation'] = true;
                body['category']='riders'
                body['email']=result.email
                let { modified, active, passcode, pending_validation, email } = body
                const auth = await auths.update(authmodel,req.params.id, { modified, active, passcode, pending_validation });
                const html = `<body><strong>Activate Your Account</strong>
                <p>Passcode:${passcode}</p><p href="adenison.com">Click here to activate<p></body>`
                const emails = auth.nModified===1  ? 
                await sendMail("no-reply@adenison.com.ng", email, "Activate Your Account", html) : null;
                console.log(emails)
                res.status(200).json(auth)   
            }
        }
        catch (error) {
            console.log({error})
            res.status(400).json({ error: error })    
        }
    },
})