const express = require('express');
const Router = require('express-promise-router');

const superUsersAuth = require('../superusersAuth.js');

const router = new Router();
const { validateSuperUserBody, schemas } = require('../handlers/routeHandler');
const superUsersController = require('../controllers/superusers');



router.route('/signup')
  .post(validateSuperUserBody(schemas.superUserAuth), superUsersController.signUp);

router.route('/signin')
  .post(validateSuperUserBody(schemas.superUserAuth), superUsersAuth.authenticate('local', { session: false }), superUsersController.signIn);

router.route('/superuser')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.resource);
router.route('/superuser/users')
  .get(superUsersAuth.authenticate('jwt', { session: false }), superUsersController.users);


module.exports = router;