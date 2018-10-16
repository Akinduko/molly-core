import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    // router.use(authMiddleware)
    router.post('/create', ctrl.create)
    return router
}
