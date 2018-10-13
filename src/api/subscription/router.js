import Controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware, paystack }) => {
    const router = express.Router();
    const ctrl = new Controllers({ entities, paystack })
    const authenticatedRoutes = express.Router()
    const routes = express.Router()
    authenticatedRoutes.use(authMiddleware)
    router.use(routes)
    router.use(authenticatedRoutes)
    /**
     * @api {post} /subscription/subscribe Create Subscription
     * @apiDescription Create a subscription
     * @apiVersion 1.0.0
     * @apiName Subscribe
     * @apiGroup Subscription
     * @apiPermission authorized 
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} AUTHORIZATION authorized token.
     * 
     * @apiSuccess (Success 200) {object}  subscription     A new subscription
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    authenticatedRoutes.post('/subscribe', ctrl.subscribe)
    /**
     * @api {delete} /subscription/unsubscribe Unsubscribe 
     * @apiDescription Unsubscribe from current subscription
     * @apiVersion 1.0.0
     * @apiName Unsubscribe
     * @apiGroup Subscription
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} AUTHORIZATION authorized token.
     *
     *
     * @apiSuccess (Created 200) {bool}  Success     If successful 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    authenticatedRoutes.post('/unsubscribe', ctrl.unsubscribe)

    /**
     * @api {delete} /subscription/verify Verify 
     * @apiDescription Verify a subscription and return subscription data
     * @apiVersion 1.0.0
     * @apiName Verify
     * @apiGroup Verify
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} AUTHORIZATION authorized token.
     *
     *
     * @apiSuccess (Created 200) {bool}  Success     If successful 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    routes.get('/verify', ctrl.verifySubscriptionToken)

    /**
     * @api {delete} /subscription/:gateway/:ref Confirm 
     * @apiDescription Confirm successful transactionn
     * @apiVersion 1.0.0
     * @apiName Verify
     * @apiGroup Verify
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} AUTHORIZATION authorized token.
     *
     *
     * @apiSuccess (Created 200) {bool}  Success     If successful 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    routes.get('/confirm/:gateway/:ref', ctrl.confirmSuccessfulTransaction)
    /** 
     * @api {get} /subscription/current Current
     * @apiDescription Get current subscription for the current user
     * @apiVersion 1.0.0
     * @apiName Current
     * @apiGroup Subscriptionn
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} AUTHORIZATION authorized token. 
     * 
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    authenticatedRoutes.get('/current', ctrl.subscription)
    return router
}