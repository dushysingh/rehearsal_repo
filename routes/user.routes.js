const express = require('express');
const router = express.Router();
const { check, oneOf, validationResult } = require('express-validator');
const userMiddleware = require('../middleware/userMiddleware');
const userController = require('../controllers/user/userController');

router.route('/singup').post([
  check('firstName').isLength({ min: 3 }),
  check('lastName').isLength({ min: 3 }),
  check('email').isEmail(),
  check('phoneNumber').isLength({ min: 10, max: 10 }),
  check('password').isAlphanumeric(),
  check('password').isLength({ max: 8 })
], userController.create); //create

router.route('/login', userMiddleware.checkToken).get([
  check('username').isEmpty(),
  check('password').isEmpty()
], userController.login);

router.route('/socialLogin').post([
  check('username').isLength({ min: 3 }),
  check('name').isLength({ min: 3 }),
  check('email').isEmail(),
  check('accessToken').isEmpty(),
  check('phone').isLength({ min: 10, max: 10 }),
  check('password').isEmpty(),
  check('device_type').isNumeric(),
  check('device_id').isEmpty(),
], userController.socialLoginCreate); //create

router.route('/forgotPassword').get([
  check('email').isEmail()
], userController.forgotPassword);

router.route('/resetPassword').put([
  check('username').isLength({ min: 3 }),
  check('email').isEmail(),
  check('password').isAlphanumeric(),
  check('password').isLength({ max: 8 })
], userController.resetPassword);

router.route('/profilePicUpload', userMiddleware.checkToken).put([
  check('filename').isEmpty()
], userController.profilePicUpload);

// router.get('/users', passport.authenticate('jwt', { session: false }), userController.get);  //read

// router.put('/users', passport.authenticate('jwt', { session: false }), userController.update); //update

// router.delete('/users', passport.authenticate('jwt', { session: false }), userController.remove); //delete

module.exports = router;