import controllers from './controllers';

const express = require('express');

export default ({ entities, authMiddleware }) => {
    const router = express.Router();
    const ctrl = controllers({ entities })

    /**
      * @api {post} /auth/login Login
      * @apiDescription Login to generate Authentication token.
      * @apiVersion 1.0.0
      * @apiName Login
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * 
      * @apiParam  {string}   email  
      * @apiParam  {string}   password  
      *
       * @apiParamExample {json} Request-Example:
       *      {
       *             "email":"exmple@email.com",
       *             "password": "password"
       *     }
      * @apiSuccess (Success 200) {Object}  auth  status and bearer token
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/login', ctrl.login)
    /**
      * @api {post} /auth/create Create
      * @apiDescription Create to generate validation passcode.
      * @apiVersion 1.0.0
      * @apiName Create
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Content-Type API Content-Type.
      * 
       * @apiParamExample {json} Request-Example:
       *      {
       *             "email":"example@email.com"
       *     }
      * @apiSuccess (Success 200) {Object}  Result
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/create', ctrl.create)
    /**
      * @api {post} /auth/signup Signup
      * @apiDescription Signup to create a validate user.
      * @apiVersion 1.0.0
      * @apiName Signup
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Content-Type API Content-Type.
      * 
       * @apiParamExample {json} Request-Example:
       *      {
       *         "user":{ 
       *             "firstname": "John",
       *             "lastname": "Doe",
       *             "address": "Lagos",
       *             "phonenumber": "012940200293",
       *             "state":"Lagos",
       *             "email":"example@email.com"
       *     },
       *         "auth":{ 
       *             "email":"example@email.com",
       *             "password": "password"
       *             }
       *     }
      * @apiSuccess (Success 200) {Object}  Result
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/signup', ctrl.signup)
    /**
      * @api {post} /auth/signup Signup
      * @apiDescription Signup to create a validate user.
      * @apiVersion 1.0.0
      * @apiName Signup
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Content-Type API Content-Type.
      * @apiParam  {string}   email  
       * @apiParam  {string}   password 
       * @apiParam  {string}   passcode 
       * @apiParamExample {json} Request-Example:
       *      {
       *             "email":"example@email.com",
       *             "password": "password",
       *             "passcode": "passcode"
       *     }
      * @apiSuccess (Success 200) {Object}  Result
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/create', ctrl.create)
    /**
      * @api {post} /auth/validate Validate
      * @apiDescription Validate to validate a created user.
      * @apiVersion 1.0.0
      * @apiName Validate
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Content-Type API Content-Type.
      * @apiParam  {string}   email  
       * @apiParam  {string}   password 
       * @apiParam  {string}   passcode 
       * @apiParamExample {json} Request-Example:
       *      {
       *             "email":"example@email.com",
       *             "password": "password",
       *             "passcode": "passcode"
       *     }
      * @apiSuccess (Success 200) {Object}  Result
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/validate', ctrl.validate)
    /**
      * @api {post} /auth/resetpassword ResetPassword
      * @apiDescription ResetPassword to reset password.
      * @apiVersion 1.0.0
      * @apiName ResetPassword
      * @apiGroup Auth
      * @apiHeader {string} X-API-KEY API access-key.
      * @apiHeader {string} Content-Type API Content-Type.
      * 
       * @apiParamExample {json} Request-Example:
       *      {
       *             "email":"example@email.com"
       *     }
      * @apiSuccess (Success 200) {Object}  Result
      *
      * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
      */
    router.post('/resetpassword', ctrl.resetpassword)
    return router
}