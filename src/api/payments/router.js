import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
    /**
      * @api {post} /payments/create/{id} create
      * @apiDescription create a payment record.
      * @apiVersion 1.0.0
      * @apiName create
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * @apiParam  {Number}   amount    In kobo
      * 
       * @apiParamExample {json} Request-Example:
       * {
                "amount":1000
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/create/:id', ctrl.create)

    // router.put('/update/:id', ctrl.update)
    /**
     * @api {get} /payments/ById/{id} paymentById
     * @apiDescription Get a paymentById
     * @apiVersion 1.0.0
     * @apiName paymentById
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Payments     A single Payment
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */    
    router.get('/ById/:id', ctrl.paymentById)
    /**
     * @api {get} /payments/ByRider/{id} paymentByRider
     * @apiDescription Get a paymentByRider
     * @apiVersion 1.0.0
     * @apiName paymentByRider
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Payments     A single Payment
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */  
    router.get('/ByRider/:id', ctrl.paymentByRider)
    /**
     * @api {get} /payments/ByUser/{id} paymentByUser
     * @apiDescription Get a paymentByUser
     * @apiVersion 1.0.0
     * @apiName paymentByUser
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Payments     A single Payment
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */  
    router.get('/ByUser/:id', ctrl.paymentByUser)
    /**
     * @api {get} /payments/ByOwner/{id} paymentByOwner
     * @apiDescription Get a paymentByOwner
     * @apiVersion 1.0.0
     * @apiName paymentByOwner
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Payments     A single Payment
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */  
    router.get('/ByOwner/:id', ctrl.paymentByOwner)
    /**
     * @api {get} /payments/confirm/{:gateway}/{:ref} confirmSuccessfulTransaction
     * @apiDescription validat a successful transaction
     * @apiVersion 1.0.0
     * @apiName confirmSuccessfulTransaction
     * @apiGroup Payments
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Payments     A single Payment
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */  
    router.get('/confirm/:gateway/:ref', ctrl.confirmSuccessfulTransaction)
    return router
}
