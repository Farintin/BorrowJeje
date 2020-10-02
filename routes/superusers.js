const express = require('express');
const Router = require('express-promise-router');

const superUsersAuth = require('../superusersAuth.js');

const router = new Router();
const { validateSuperUserBody, validateUserBody, schemas } = require('../handlers/routeHandler');
const superUsersController = require('../controllers/superusers');
const usersController = require('../controllers/users');



router.route('/signup')
  .post(validateSuperUserBody(schemas.superUserAuth), superUsersController.signUp);

router.route('/signin')
  .post(validateSuperUserBody(schemas.superUserAuth), superUsersAuth.authenticate('local', { session: false }), usersController.signIn);

router.route('/superuser')
  .get(superUsersAuth.authenticate('jwt', { session: false }), usersController.idData);

router.route('/superuser/users/details')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.usersDetail);
router.route('/superuser/users/details/:userId')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.userDetail);

router.route('/superuser/users')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.users);
router.route('/superuser/users')
  .delete(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.deleteUsers);

router.route('/superuser/users/:id')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.user);
router.route('/superuser/users/:id')
  .delete(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.deleteUser);

router.route('/superuser/users/:id/detail')
  .patch(validateUserBody(schemas.userDetail), superUsersAuth.authenticate('jwt', { session: false }), superUsersController.updateAUserDetails);
router.route('/superuser/users/:id/auth/phoneNo')
  .patch(validateUserBody(schemas.userPhoneNo), superUsersAuth.authenticate('jwt', { session: false }), superUsersController.updateAUserPhoneNo);
router.route('/superuser/users/:id/auth/pin')
  .patch(validateUserBody(schemas.userPin), superUsersAuth.authenticate('jwt', { session: false }), superUsersController.updateAUserPin);



module.exports = router;