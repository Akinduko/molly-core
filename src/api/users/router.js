import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
    router.get('/me', ctrl.getCurrentUser)
    router.put('/update', ctrl.update)
    router.put('/update/role/:id', ctrl.updateRole)
    router.post('/dispatch/request', ctrl.requestDispatch)
    router.put('/dispatch/cancel/:id', ctrl.cancelDispatch)
    return router
}