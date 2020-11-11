const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const organisationMiddleware = require('../middleware/organisationMiddleware');
const organisationController = require('../controllers/organisation/organisationController');

router.route('/singup').post([
  check('firstName').isLength({ min: 3 }),
  check('lastName').isLength({ min: 3 }),
  check('email').isEmail(),
  check('phoneNumber').isLength({ min: 10, max: 10 }),
  check('password').isAlphanumeric(),
  check('password').isLength({ max: 8 })
], organisationController.create); //create

router.route('/login', organisationMiddleware.checkToken).get([
  // check('username').isEmpty(),
  // check('password').isEmpty()
], organisationController.login);

router.route('/socialLogin').post([
  check('username').isLength({ min: 3 }),
  check('name').isLength({ min: 3 }),
  check('email').isEmail(),
  check('accessToken').isEmpty(),
  check('phone').isLength({ min: 10, max: 10 }),
  check('password').isEmpty(),
  check('device_type').isNumeric(),
  check('device_id').isEmpty(),
], organisationController.socialLoginCreate); //create

router.route('/forgotPassword').get([
  check('email').isEmail()
], organisationController.forgotPassword);

router.route('/resetPassword').put([
  check('username').isLength({ min: 3 }),
  check('email').isEmail(),
  check('password').isAlphanumeric(),
  check('password').isLength({ max: 8 })
], organisationController.resetPassword);

router.route('/profilePicUpload', organisationMiddleware.checkToken).put([
  check('filename').isEmpty()
], organisationController.profilePicUpload);

module.exports = router;