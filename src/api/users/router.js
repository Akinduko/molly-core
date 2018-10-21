import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
    /**
     * @api {get} /users/me getCurrentUser
     * @apiDescription Get Current User profile.
     * @apiVersion 1.0.0
     * @apiName getCurrentUser
     * @apiGroup Users
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  getCurrentUser   
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/me', ctrl.getCurrentUser)
        /**
      * @api {put} /users/update update
      * @apiDescription  to update a user account.
      * @apiVersion 1.0.0
      * @apiName update
      * @apiGroup Users
      *
      * 
       * @apiParam {string} [firstname]
       * @apiParam {string} [address]
       * @apiParam {string} [lastname]
       * @apiParam {string} [phonenumber]
       * @apiParam {string} [state].
       * @apiParam {string} [email].
       * @apiParamExample {json} Request-Example:
       *     {  
                "firstname" : "Test",
                "lastname" : "Test", 
                "address" : "Test", 
                "phonenumber" : "08909284090",
                "state" : "Test", 
                "email" : "test@email.com"
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/update', ctrl.update)
    // router.put('/update/role/:id', ctrl.updateRole)
        /**
      * @api {post} /users/dispatch/request requestDispatch
      * @apiDescription request a dispatch.
      * @apiVersion 1.0.0
      * @apiName requestDispatch
      * @apiGroup Users
      *
      * 
       * @apiParamExample {json} Request-Example:
       *     {
                "origingeo":{"originlat":6.42610, "originlng":3.4621},
                "destinationgeo":{"destinationlat":6.42610, "destinationlng":3.4621},
                "origin":"No 6 Kilimanjaro Street, New york",
                "destination":"9 bedfordshire street, Lagos"
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/dispatch/request', ctrl.requestDispatch)
        /**
      * @api {put} /users/dispatch/cancel/:id cancelDispatch
      * @apiDescription request to cancel a dispatch.
      * @apiVersion 1.0.0
      * @apiName cancelDispatch
      * @apiGroup Users
      *
      * 
       * @apiParam {string} reason
       * @apiParamExample {json} Request-Example:
       *     {  
                "reason" : "Test",
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/dispatch/cancel/:id', ctrl.cancelDispatch)
    return router
}