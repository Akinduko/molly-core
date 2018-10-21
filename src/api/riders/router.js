import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    /**
      * @api {post} /riders/request request
      * @apiDescription request to create a rider account.
      * @apiVersion 1.0.0
      * @apiName request
      * @apiGroup Riders
      *
      * 
       * @apiParam {string} firstname
       * @apiParam {string} address
       * @apiParam {string} lastname
       * @apiParam {string} phonenumber
       * @apiParam {string} state.
       * @apiParam {string} email.
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
    router.post('/request', ctrl.request)
    router.use(authMiddleware)
    /**
     * @api {get} /riders/me getCurrentRider
     * @apiDescription Get Current Rider profile.
     * @apiVersion 1.0.0
     * @apiName getCurrentRider
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     An Array of Dispatch Requests
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/me', ctrl.getCurrentUser)
    /**
      * @api {put} /riders/update update
      * @apiDescription  to update a rider account.
      * @apiVersion 1.0.0
      * @apiName update
      * @apiGroup Riders
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
      * @api {put} /riders/dispatch/cancel/:id cancelDispatch
      * @apiDescription request to cancel a dispatch.
      * @apiVersion 1.0.0
      * @apiName cancelDispatch
      * @apiGroup Riders
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
    /**
     * @api {get} /riders/dispatch/accept/id acceptDispatch
     * @apiDescription Accept a dispatch request by id
     * @apiVersion 1.0.0
     * @apiName acceptDispatch
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/dispatch/accept/:id', ctrl.acceptDispatch)
        /**
     * @api {get} /riders/dispatch/start/id startDispatch
     * @apiDescription Start a dispatch request by id
     * @apiVersion 1.0.0
     * @apiName startDispatch
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/dispatch/start/:id', ctrl.startDispatch)
        /**
     * @api {get} /riders/dispatch/deliver/id deliverDispatch
     * @apiDescription Start a dispatch request by id
     * @apiVersion 1.0.0
     * @apiName deliverDispatch
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */

    router.get('/dispatch/deliver/:id', ctrl.deliverDispatch)
    /**
     * @api {get} /riders/dispatch/near?lat={lat}&long={long} getNear
     * @apiDescription Retrieve nearby dispatch requests.
     * @apiVersion 1.0.0
     * @apiName getNear
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     An Array of Dispatch Requests
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/dispatch/near', ctrl.getNear)
    return router
}