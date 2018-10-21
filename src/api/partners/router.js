import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    /**
      * @api {post} /partners/request request
      * @apiDescription request to create a Partner account.
      * @apiVersion 1.0.0
      * @apiName request
      * @apiGroup Partners
      *
      * 
       * @apiParamExample {json} Request-Example:
       *     {  
             	"name" : "test",
                "company" : "test", 
                "address" : "test", 
                "phonenumber" : "097654448786",
                "state" : "test", 
                "email" : "test@email.com",
                "payment":{
                    "business_name": "test",
                    "settlement_bank": "test Bank", 
                    "account_number": "0193274682"
                }
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/request', ctrl.request)
    router.use(authMiddleware)
   /**
     * @api {get} /riders/{id} getCurrentPartner
     * @apiDescription Get Current Partner profile.
     * @apiVersion 1.0.0
     * @apiName getCurrentPartner
     * @apiGroup Partners
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Partner     An Array of Dispatch Requests
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/:id', ctrl.getCurrentPartner)
    /**
      * @api {put} /partners/update update
      * @apiDescription request to update a Partner account.
      * @apiVersion 1.0.0
      * @apiName update
      * @apiGroup Partners
      *
      * 
       * @apiParamExample {json} Request-Example:
       *     {  
             	"name" : "test",
                "company" : "test", 
                "address" : "test", 
                "phonenumber" : "097654448786",
                "state" : "test", 
                "email" : "test@email.com",
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/update', ctrl.update)
    // router.post('/add/rider', ctrl.addRider)
        /**
     * @api {get} /partners/riders getAllRiders
     * @apiDescription Get all riders
     * @apiVersion 1.0.0
     * @apiName getAllRiders
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  riders     A list of riders
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/riders', ctrl.getAllRiders)
        /**
     * @api {get} /partners/riders/byId/id getRidersbyId
     * @apiDescription Get a partner's rider by id
     * @apiVersion 1.0.0
     * @apiName getRidersbyId
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Riders     A single rider 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/riders/byId/:id', ctrl.getRidersbyId)
    /**
     * @api {get} /partners/dispatch getAllDispatch
     * @apiDescription Get all dispatch
     * @apiVersion 1.0.0
     * @apiName getAllDispatch
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     *
     * @apiSuccess (Created 200) {object}  dispatch     A list of dispatch
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/dispatch', ctrl.getAllDispatch)
            /**
     * @api {get} /partners/dispatch/byRider/id getDispatchByRiders
     * @apiDescription Get a partner's rider by id
     * @apiVersion 1.0.0
     * @apiName getDispatchByRiders
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/dispatch/byRider/:id', ctrl.getDispatchByRiders)
    /**
     * @api {get} /partners/payment/byRider/id getPaymentByRiders
     * @apiDescription Get a partner's payments by Rider id
     * @apiVersion 1.0.0
     * @apiName getPaymentByRiders
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  payment     A single payment 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/payment/byRider/:id', ctrl.getPaymentByRiders)
           /**
     * @api {get} /partners/payment getAllPayment
     * @apiDescription Get all payments
     * @apiVersion 1.0.0
     * @apiName getAllPayment
     * @apiGroup Partners
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  payments     A list of payments
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/payment', ctrl.getAllPayment)
    return router
}
