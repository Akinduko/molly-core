import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    // ```
    // curl -X POST \
    // http://127.0.0.1:8000/api/v1/auth/signup \
    // -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYjFkYzU1NTE2YmU2N2Q1NjAxMGUyYiIsImlhdCI6MTUzODM4NjA0NSwiZXhwIjoxNTM4Mzk2ODQ1fQ.r4i4SBfv7Wq8Co6hGZmFs719s0EiMv48NqS2QlE-D9Y' \
    // -H 'cache-control: no-cache' \
    // -H 'content-type: application/json' \
    // -H 'postman-token: 8ae7bd8a-4951-d7b6-57b3-95e290658de3' \
    // -d '{"user":{ 
    //     "firstname": "Olugbenga",
    //     "lastname": "Akinduko",
    //     "address": "Akure",
    //     "phonenumber": "08032823104",
    //     "state":"Ondo",
    //     "email":"akindukooa@gmail.com"
    // },
    // "auth":{ 
    //     "email":"akindukooa@gmail.com",
    //     "password": "password"
    // }
    // }'
    // ```
    router.post('/login', ctrl.login)
    router.post('/signup', ctrl.signup)
    router.post('/create',ctrl.create)
    router.post('/validate',ctrl.validate)
    router.post('/resetpassword',ctrl.resetpassword)
    return router
}