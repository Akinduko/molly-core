import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
        /**
     * @api {get} /riders/ById/id dispatchById
     * @apiDescription Get a dispatch by id
     * @apiVersion 1.0.0
     * @apiName dispatchById
     * @apiGroup Dispatch
     * @apiPermission authorized
     * 
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/ById/:id', ctrl.dispatchById)
    /**
     * @api {get} /riders/ByRider/id dispatchByRider
     * @apiDescription Get a dispatch by rider id
     * @apiVersion 1.0.0
     * @apiName dispatchByRider
     * @apiGroup Dispatch
     * @apiPermission authorized
     * 
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/ByRider/:id', ctrl.dispatchByRider)
    /**
     * @api {get} /riders/ByUser/id dispatchByUser
     * @apiDescription Get a dispatch by user id
     * @apiVersion 1.0.0
     * @apiName dispatchByUser
     * @apiGroup Dispatch
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/ByUser/:id', ctrl.dispatchByUser)
    /**
     * @api {get} /riders/ByOwner/id dispatchByOwner
     * @apiDescription Get a dispatch by owner id
     * @apiVersion 1.0.0
     * @apiName dispatchByOwner
     * @apiGroup Dispatch
     * @apiPermission authorized
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     A single Dispatch 
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
    router.get('/ByOwner/:id', ctrl.dispatchByOwner)
    return router
}