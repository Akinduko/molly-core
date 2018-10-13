import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.post('/request', ctrl.request)
    router.use(authMiddleware)
    router.get('/me', ctrl.getCurrentPartner)
    router.put('/update', ctrl.update)
    router.post('/add/rider', ctrl.addRider)
    router.get('/riders', ctrl.getAllRiders)
    router.get('/riders/byId/:id', ctrl.getRidersbyId)
    router.get('/dispatch', ctrl.getAllDispatch)
    router.get('/dispatch/byRider/:id', ctrl.getDispatchByRiders)
    router.get('/payment/byRider/:id', ctrl.getPaymentByRiders)
    router.get('/payment', ctrl.getAllPayment)
    return router
}
