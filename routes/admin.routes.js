const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/admin/adminController');

router.route('/login').get([
    // check('username').isEmpty(),
    // check('password').isEmpty()
  ], adminController.login);
  
  router.route('/forgotPassword').get([
    // check('email').isEmail()
  ], adminController.forgotPassword);

  router.route('/forgotPasswordEmail/:token').get(adminController.verifyForgotPasswordEmail);
  
  router.route('/resetPassword').put([
     check('email').isEmail(),
    // check('password').isAlphanumeric(),
    // check('password').isLength({ max: 8 })
  ], adminController.resetPassword);
  
  module.exports = router;