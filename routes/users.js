const express = require('express');
const Router = require('express-promise-router');

const usersAuth = require('../usersAuth.js');

const router = new Router();
const { validateUserBody, schemas } = require('../handlers/routeHandler');
const UsersController = require('../controllers/users');



router.route('/signup')
  .post(validateUserBody(schemas.userAuth), UsersController.signUp);
  
router.route('/signin')
  .post(validateUserBody(schemas.userAuth), usersAuth.authenticate('local', { session: false }), UsersController.signIn);

router.route('/user')
  .get(usersAuth.authenticate('jwt', { session: false }), UsersController.idData);

router.route('/user/detail')
  .get(usersAuth.authenticate('jwt', { session: false }), UsersController.detail);
router.route('/user/detail')
  .post(validateUserBody(schemas.userDetailInit), usersAuth.authenticate('jwt', { session: false }), UsersController.collectNecessaryDetails);

router.route('/user/setting/detail')
  .patch(validateUserBody(schemas.userDetail), usersAuth.authenticate('jwt', { session: false }), UsersController.updateDetails);
router.route('/user/setting/auth/phoneNo')
  .patch(validateUserBody(schemas.userPhoneNo), usersAuth.authenticate('jwt', { session: false }), UsersController.updatePhoneNo);
router.route('/user/setting/auth/pin')
  .patch(validateUserBody(schemas.userPin), usersAuth.authenticate('jwt', { session: false }), UsersController.updatePin);


module.exports = router;