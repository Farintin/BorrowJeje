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
  .get(usersAuth.authenticate('jwt', { session: false }), UsersController.resource);

router.route('/user/details')
  .get(usersAuth.authenticate('jwt', { session: false }), UsersController.details);
router.route('/user/details')
  .post(validateUserBody(schemas.userDetails), usersAuth.authenticate('jwt', { session: false }), UsersController.registerDetails);


module.exports = router;