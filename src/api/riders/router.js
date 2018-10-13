import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.post('/request', ctrl.request)
    router.use(authMiddleware)
    router.get('/me', ctrl.getCurrentUser)
    router.put('/update', ctrl.update)
    router.put('/update/role/:id', ctrl.updateRole)
    router.put('/dispatch/cancel/:id', ctrl.cancelDispatch)
    router.get('/dispatch/accept/:id', ctrl.acceptDispatch)
    router.get('/dispatch/start/:id', ctrl.startDispatch)
    router.get('/dispatch/deliver/:id', ctrl.startDispatch)
    router.get('/dispatch/near', ctrl.getNear)
    return router
}