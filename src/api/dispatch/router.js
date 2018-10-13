import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
    router.get('/ById/:id', ctrl.dispatchById)
    router.get('/ByRider/:id', ctrl.dispatchByRider)
    router.get('/ByUser/:id', ctrl.dispatchByUser)
    router.get('/ByOwner/:id', ctrl.dispatchByOwner)
    return router
}