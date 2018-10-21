import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })
    router.use(authMiddleware)
    /**
     * @api {post} /locations/broadcast broadcast
     * @apiDescription broadcast current location.
     * @apiVersion 1.0.0
     * @apiName broadcast
     * @apiGroup Locations
     *
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiParamExample {json} Request-Example:
     *    {
                "available":true,
                "geometry":{"lat":-81, "lng":25.791},
                "owner":"xyz1234"
            }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/broadcast', ctrl.broadcast)
    /**
     * @api {get} /locations/near?lat={lat}&long={long} getNear
     * @apiDescription Retrieve nearby riders.
     * @apiVersion 1.0.0
     * @apiName getNear
     * @apiGroup Riders
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     *
     * @apiSuccess (Created 200) {object}  Dispatch     An Array of Dispatch Requests
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     */
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

    /**
     * @api {put} /locations/distance calculateDistance
     * @apiDescription calculateDistance from source to destination.
     * @apiVersion 1.0.0
     * @apiName calculateDistance
     * @apiGroup Locations
    * @apiPrivate
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiParamExample {json} Request-Example:
     *    {
            "origin":{"lat":6.4742299, "lng":3.384652},
            "destination":{"lat":6.4261709, "lng":3.46402}
        }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */

    router.put('/distance',ctrl.calculateDistance)
    /**
     * @api {put} /locations/distance getEstimate
     * @apiDescription Get estimate cost from source to destination.
     * @apiVersion 1.0.0
     * @apiName getEstimate
     * @apiGroup Locations
     *
     * @apiPermission authorized
     *
     * @apiHeader {string} X-API-KEY API access-key.
     * @apiHeader {string} Authentication Bearer Token.
     * 
     * @apiParamExample {json} Request-Example:
     *   {
            "geolocations":{
                    "origin":{"lat":6.4742299, "lng":3.384652},
                    "destination":{"lat":6.4261709, "lng":3.46402}
                },
            "dimension":20
        }
      * @apiSuccess (Success 200) {Object}  Success
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.put('/estimate',ctrl.getEstimate)
    return router
}