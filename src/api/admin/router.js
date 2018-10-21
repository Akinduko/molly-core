import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })

    /**
     * @api {get} /admin/roles All
     * @apiDescription Get all roles
     * @apiVersion 1.0.0
     * @apiName All
     * @apiGroup Admin
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  roles     A list of roles
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */

    router.get('/roles', ctrl.getRoles)

    /**
     * @api {get} /admin/roles/byId/{id} ById
     * @apiDescription Get a role by id
     * @apiVersion 1.0.0
     * @apiName Role by id
     * @apiGroup Admin
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiSuccess (Created 200) {object}  Role     A single role 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */

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
    /**
      * @api {post} /admin/roles/create createRoles
      * @apiDescription createRoles to create a new Role.
      * @apiVersion 1.0.0
      * @apiName createRoles
      * @apiGroup Admin
      * @apiPermission authorized
      *
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Authentication Bearer Token.
      * 
      *
       * @apiParamExample {json} Request-Example:
       *     {
                "name":"owner",
                "description":"roles for superadmin",
                "roles":{
                    "users":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "riders":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "auth":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "role":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    }
                }
            }
      * @apiSuccess (Success 200) {Object}  Result  
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
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

    /**
      * @api {put} /admin/roles/grantRole/:id grantRole
      * @apiDescription grantRole to grant a role some permissions.
      * @apiVersion 1.0.0
      * @apiName grantRole
      * @apiGroup Admin
      * @apiPermission authorized
      *
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Authentication Bearer Token.
      * 
      *
       * @apiParamExample {json} Request-Example:
       *     {
                    "users":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "riders":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "auth":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    },
                    "role":{
                    "create:any":["*"],
                    "update:any":["*"],
                    "read:any":["*"]
                    }
            }
      * @apiSuccess (Success 200) {Object}  auth  status and bearer token
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/roles/grantRole/:id', ctrl.grantRoleById)
    /**
      * @api {put} /admin/roles/revokeRole/:id revokeRole
      * @apiDescription revokeRole to revoke permissions from a role.
      * @apiVersion 1.0.0
      * @apiName revokeRole
      * @apiGroup Admin
      * @apiPermission authorized
      *
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Authentication Bearer Token.
      * 
      *
       * @apiParamExample {json} Request-Example:
       *     {
                    "users":true,
                    "riders":true,
                    "auth":true,
                    "role":true
            }
      * @apiSuccess (Success 200) {Object}  auth  status and bearer token
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/roles/revokeRole/:id', ctrl.revokeRoleById)
    /**
     * @api {get} /admin/riders/pending getPendingRiders
     * @apiDescription Get all Pending Riders
     * @apiVersion 1.0.0
     * @apiName getPendingRiders
     * @apiGroup Admin
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiSuccess (Created 200) {object}  Riders     An Array of Pending Riders
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/riders/pending', ctrl.getPendingRiders)
    /**
     * @api {get} /admin/partners/pending getPendingPartners
     * @apiDescription Get all Pending Partners
     * @apiVersion 1.0.0
     * @apiName getPendingPartners
     * @apiGroup Admin
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiSuccess (Created 200) {object}  Partners     An Array of Pending Partners
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/partners/pending',ctrl.getPendingPartners)
    /**
      * @api {put} /admin/partners/grant/:id grantPendingPartner
      * @apiDescription grantPendingPartner to grant permissions to a pending partner.
      * @apiVersion 1.0.0
      * @apiName grantPendingPartner
      * @apiGroup Admin
      * @apiPermission authorized
      *
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Authentication Bearer Token.
      * 
       * @apiParam {Number} perc.
       * @apiParamExample {json} Request-Example:
       *     {
                    "perc":18.0
            }
      * @apiSuccess (Success 200) {Object}  credentials  apikey and secretkey
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/partners/grant/:id',ctrl.grantPendingPartner)
    /**
     * @api {get} /riders/grant/:id grantPendingRider
     * @apiDescription Grant Pending Rider By Id
     * @apiVersion 1.0.0
     * @apiName grantPendingRider
     * @apiGroup Admin
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiSuccess (Created 200) {object}  Rider    
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/riders/grant/:id',ctrl.grantPendingRider)
    return router
}