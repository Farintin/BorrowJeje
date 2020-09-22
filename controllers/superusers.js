const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const superUser = require('../models/superuser.model');

signToken = user => {
    return token = JWT.sign({
        iss: 'BorrowJeje',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET)
};

module.exports = {
    signUp: async (req, res, next) => {
        console.log('superUsersController.signUp() called!');
        const { username } = req.value.body;

        const aSuperUser = await superUser.findOne({ username: username });
        if (aSuperUser) {
            return res.status(403).json({
                error: 'username already in use'
            })
        };
        // Create a new user
        const newSuperUser = new superUser(req.value.body);
        await newSuperUser.save();

        // Generate token
        const token = signToken(newSuperUser);
        // Send token
        res.status(200).json({ token })
    },

    signIn: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        // Send token
        res.status(200).json({ token })
    },

    resource: async (req, res, next) => {
        console.log('super-user account');
        res.status(200).json({ superuser: req.user })
    },

    users: async (req, res, next) => {
        console.log('users data');
        const users = await User.find({});
        res.status(200).json({ users: users })
    }
}