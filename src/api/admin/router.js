import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    // router.use(authMiddleware)
    // ```
    // curl -X GET \
    // http://127.0.0.1:8000/api/v1/roles \
    // -H 'authorization: Bearer eyJhbGciOiJIUz' \
    // ```
    router.get('/roles', ctrl.getRoles)
    // ```
    // curl -X GET \
    // http://127.0.0.1:8000/api/v1/roles/byId/5bb3ec17a86b559ebcb90573  \
    // -H 'authorization: Bearer eyJhbGciOiJIUz' \
    // ```
    router.get('/roles/byId/:id', ctrl.getRoleById)
    // ``` 
    // curl -X POST \
    //   http://127.0.0.1:8000/api/v1/roles\
    //   -H 'authorization: Bearer 81XGTsb2JZC6DfMF83J9MmxtBDSWidbZT-eE' \
    //   -H 'cache-control: no-cache' \
    //   -H 'content-type: application/json' \
    //   -H 'postman-token: 06590ff7-9b3c-fdd7-c3b1-fc9bceca3337' \
    //   -d '{
    // 	"name":"owner",
    // 	"description":"roles for superadmin",
    // 	"roles":{
    // 		"users":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"riders":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"auth":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"role":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		}
    // 	}
    // }'
    // ```

    router.post('/roles/create', ctrl.createRoles)
  
    // ``` 
    // curl -X PUT \
    //   http://127.0.0.1:8000/api/v1/roles/byId/5bb3ec17a86b559ebcb90573 \
    //   -H 'authorization: Bearer 81XGTsb2JZC6DfMF83J9MmxtBDSWidbZT-eE' \
    //   -H 'cache-control: no-cache' \
    //   -H 'content-type: application/json' \
    //   -H 'postman-token: 06590ff7-9b3c-fdd7-c3b1-fc9bceca3337' \
    //   -d '{
    // 	"name":"owner",
    // 	"description":"roles for superadmin",
    // 	"roles":{
    // 		"users":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"riders":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"auth":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		},
    // 		"role":{
    // 		"create:any":["*"],
    // 		"update:any":["*"],
    // 		"read:any":["*"]
    // 		}
    // 	}
    // }'
    // ```
    router.put('/roles/grantRole/:id', ctrl.grantRoleById)
    router.put('/roles/revokeRole/:id', ctrl.revokeRoleById)
    router.get('/riders/pending', ctrl.getPendingRiders)
    router.get('/partners/pending',ctrl.getPendingPartners)
    router.get('/partners/grant/:id',ctrl.grantPendingPartner)
    router.get('/riders/grant/:id',ctrl.grantPendingRider)
    return router
}