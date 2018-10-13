import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    // router.use(authMiddleware)
    router.post('/broadcast', ctrl.broadcast)
    router.get('/near', ctrl.getNear)
//     ```curl -X POST \
//     http://127.0.0.1:8000/api/v1/locations/getdistance \
//     -H 'cache-control: no-cache' \
//     -H 'content-type: application/json' \
//     -H 'postman-token: c5e6bc79-a353-a569-f661-c7ed2ca2e672' \
//     -H 'x-api-key: e98537b4-5bd6-3e3d-6f7f-e9820cf33979' \
//     -d '{
//       "origin":{"lat":6.4742299, "lng":3.384652},
//       "destination":{"lat":6.4742299, "lng":3.384652}
//   }' ```
    router.put('/distance',ctrl.calculateDistance)
    router.put('/estimate',ctrl.getEstimate)
    return router
}