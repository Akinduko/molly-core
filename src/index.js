/**
 * Copyright 2018 Adenison NG. All Rights Reserved. 
 * 
 */
'use strict';

require('dotenv').load()
import endpoints from './api';
import entities, { schemas } from './entities'
import orm from './dborm'
import maps from './mapsorm'
import mongoose from 'mongoose'
import config from './config';
import express from 'express'
import { apiAuthMiddleware } from './middleware/authentication'
import os from 'os'
import Influx  from 'influx';
import { apiKey } from './middleware/apikey'
import crypto from 'crypto'
const logger = require('./utils/logger').logger;
import { hmac } from './middleware/hmac';

const cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser')
const cors = require('cors')({ origin: true });
const app = express();




// var paystack = require('paystack')(config.PAYSACK_SECRET_KEY);

const e = entities(
    orm(mongoose),
    maps()
)

// cors, cross origin requests
app.use(cors);
// parse cookies
app.use(cookieParser);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(apiKey({ models: e }))

app.use(hmac({ models: e }))
// handle timeouts. 
app.use(function (req, res, next) {
    res.setTimeout(80000, function () {
        console.log('Request has timed out.');
        res.sendStatus(408);
    });

    next();
});

logger.info('Mongo Request:' + config.DB_URL)

mongoose.connect(`${config.DB_URL}`,{ useNewUrlParser: true }).then(
    
() => { 
        logger.info('Mongo Response: connected Succesfully');
        },
 
err => 
      {      
       const mongoError={message: err.message,status: 99 };
        logger.info('Mongo Response:   '+ JSON.stringify(mongoError));
      }
);

// var influxhost = process.env.influxhost;
// var influxdatabase = process.env.influxdatabase;
// var influxport = process.env.influxport;
// const influx = new Influx.InfluxDB({
//   host: influxhost,
//   database: influxdatabase,
//   port:influxport,
//   schema: [
//     {
//       measurement: Influx.FieldType.STRING,
//       fields: {
//         duration: Influx.FieldType.FLOAT,
//         count: Influx.FieldType.INTEGER
//       },
//       tags: [
//         'path','host'
//       ]
//     }
//   ]
// })
// influx.getDatabaseNames()
//   .then(names => {
//     if (!names.includes(influxdatabase)) {
//       return influx.createDatabase(influxdatabase);
//     }
//   })
//   .then(() => {
//     var appTimeout = process.env.appTimeout;
//     var port = process.env.appPORT;
//     var server = app.listen(port, function() {
//       logger.info('Express server listening on port ' + port);
//       var timeout = server.setTimeout(parseInt(appTimeout));
//     });
//   })
//   .catch(err => {
//     logger.info(`Error creating Influx database!`);
//   })

//     app.use((req, res, next) => {
//     const start = Date.now()

//     res.on('finish', () => {
//       const duration = Date.now() - start
//       logger.info(`Request to ${req.path} took ${duration}ms`);

//       influx.writePoints([
//         {
//           measurement: 'core.response',
//           tags: { host: os.hostname() , path: req.path},
//           fields: {duration: duration, count: 1}
//         }
//       ])

//       .catch(err => {
//         logger.info(`Error saving data to InfluxDB! ${err.stack}`)
//       })
//     })
//     return next()
//   })

const api = express.Router()
// generate all defined routes
const routes = Object.keys(endpoints)
for (let ix = 0; ix < routes.length; ix++) {
    const name = routes[ix];
    const router = endpoints[name]({
        entities: e,
        // paystack,
        logger:logger,
        authMiddleware: apiAuthMiddleware({ models: e }),
    })
    logger.info(`creating ${name} route`)
    api.use(`/v1/${name}`, router);
    /**
     const router = endpoints[name]({
            entities: e,
            indexers,
            recommenders,
            authMiddleware: (req, res, next) => {
                next()
            }
        })**/

    // console.log(`creating ${name} route`)

}

// generate all defined routes


const admin = express.Router();


// generate all defined routes
const adminroutes = Object.keys(endpoints)
for (let ix = 0; ix < adminroutes.length; ix++) {
    const name = adminroutes[ix];
    const router = endpoints[name]({
        entities: e,
        logger:logger,
        authMiddleware: (req, res, next) => {
            next()
        },
    })
    logger.info(`creating ${name} route`)
    admin.use(`/v1/${name}`, router);
}


admin.use(`/v1/schemas`, (req, res, next) => {
    res.status(200).json(schemas)
})

app.use('/api', api)
app.use('/admin', admin)

// Catch all non existent routes

app.use(function(req, res, next) {
  var err = new Error('Page not Found');
  err.status = 404;
  const error404={message: err.message,status: 99 };
  logger.info('Core response: '+JSON.stringify(error404));
  res.setHeader('Content-Type' , 'application/json')
  res.status(404).json({message: err.message,status: 99 });
});
// catch 404 and forward to error handler

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    const error500={message: err.message,status: 99 };
    logger.info('Core response: '+JSON.stringify(error500));
    res.setHeader('Content-Type' , 'application/json')
    res.status(500).json({message: 'Internal Server error',status: 99 });
});

app.use(function(err, req, res, next) {
    res.status(err.code || 504);
    const error504={message: err.message,status: 99 };
    logger.info('Core response: '+JSON.stringify(error504));
    res.setHeader('Content-Type' , 'application/json')
    res.status(504).json({message: err.message,status: 99 });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 598);
    const error598={message: err.message,status: 99 };
    logger.info('Core response: '+JSON.stringify(error598));
    res.setHeader('Content-Type' , 'application/json')
    res.status(598).json({message: err.message,status: 99 });
});

app.use(function(err, req, res, next) {
    res.status(err.status || 408);
    const error408={message: err.message,status: 99 };
    logger.info('Core response: '+JSON.stringify(error408));
    res.setHeader('Content-Type' , 'application/json')
    res.status(408).json({message: err.message,status: 99 });
});

var port = process.env.PORT || 8000
logger.info('Port ', port)
app.listen(port, () => console.log('Listening on port ' + port))
