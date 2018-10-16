import Users from './users'
import Riders from './riders'
import Auths from './auths'
import Roles from './roles'
import AccessKeys from './accesskeys'
import Locations from './locations'
import Partners from './partners'
import Dispatch from './dispatch'
import Payments from './payments'



export const schemas = [
        require('./users').schema,
        require('./riders').schema,
        require('./auths').schema,
        require('./roles').schema,
        require('./accesskeys').schema,
        require('./locations').schema,
        require('./partners').schema,
        require('./dispatch').schema,
        require('./payments').schema
]
export default (orm,maps) => {
        return {
                users: new Users({ orm, name: 'users' }),
                riders: new Riders({ orm, name: 'riders' }),
                auths: new Auths({ orm, name: 'auths' }),
                roles: new Roles({ orm, name: 'roles' }),
                locations: new Locations({orm, name:'locations', maps}),
                accesskeys: new AccessKeys({orm, name: 'accesskeys'}),
                partners: new Partners({orm,name:'partners'}),
                dispatch: new Dispatch({orm,name:'dispatch'}),
                payments: new Payments({orm,name:'payments'}),

        }
}