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

router.route('/forgotPasswordEmail/:token').get(organisationController.verifyForgotPasswordEmail);

router.route('/resetPassword').put([
  check('email').isEmail(),
  check('password').isAlphanumeric(),
  check('password').isLength({ max: 8 })
], organisationController.resetPassword);

router.route('/profilePicUpload', organisationMiddleware.checkToken).put([
  check('filename').isEmpty()
], organisationController.profilePicUpload);

router.route('/ensemble').post(organisationMiddleware.checkToken, [
  check('name').isLength({ min: 3 })
], organisationController.ensembleCreate); //create

router.route('/ensembleList').get(organisationMiddleware.checkToken, [
], organisationController.ensembleList);

router.route('/trackRequest').post(organisationMiddleware.checkToken, [
  check('title').isLength({ min: 3 }),
  check('composer_name').isLength({ min: 3 })
], organisationController.trackRequest);

router.route('/searchSong').get(organisationMiddleware.checkToken, [
], organisationController.searchSong);

router.route('/libraryAdd').post(organisationMiddleware.checkToken, [
  check('library_name').isLength({ min: 3 })
], organisationController.libraryAdd);

router.route('/songLibrary').post(organisationMiddleware.checkToken, [
  // check('library_id').isEmpty(),
  // check('song_id').isEmpty()
], organisationController.addSongToLibrary);

router.route('/songList').get(organisationMiddleware.checkToken, [
], organisationController.songList);

router.route('/librarySongs').get(organisationMiddleware.checkToken, [
], organisationController.librarySongsList);

router.route('/librarySongs').delete(organisationMiddleware.checkToken, [
], organisationController.deleteLibrarySong);

module.exports = router;