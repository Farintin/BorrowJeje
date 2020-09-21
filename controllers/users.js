const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../config');

signToken = user => {
    return token = JWT.sign({
        iss: 'BorrowJeje',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)
};

module.exports = {
    signUp: async (req, res, next) => {
        console.log('UsersController.signUp() called!');
        const { phoneNo } = req.value.body;

        const aUser = await User.findOne({ phoneNo: phoneNo });
        if (aUser) {
            return res.status(403).json({
                error: 'Phone already in use'
            })
        };
        // Create a new user
        const newUser = new User(req.value.body);
        await newUser.save();

        // Generate token
        const token = signToken(newUser);
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
        console.log('User account');
        res.status(200).json({ user: req.user })
    },

    details: async (req, res, next) => {
        console.log('details');
        res.status(200).json({ details: req.user.details })
    },
    registerDetails: async (req, res, next) => {
        console.log('Update details');
        
        const userData = req.value.body;
        if (userData.details.birthDate) {
            const bD = userData.details.birthDate;
            const bY = bD.year, bM = bD.month, bd = bD.day;
            userData.details.birthDate = new Date(bY, bM, bd);
        }

        const userId = req.user.id
        //console.log(`userId: ${userId}`);
        //console.log(`req: ${userData.details}`);

        const userUpdate = await User.findByIdAndUpdate(userId, userData, {new: true, useFindAndModify: false });
        console.log('Updated user');
        res.status(200).json({ user: userUpdate })
    }
}