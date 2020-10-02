const JWT = require('jsonwebtoken');
const { User, Detail } = require('../models/user.model');

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

    idData: async (req, res, next) => {
        console.log('account data');
        res.status(200).json({ user: req.user })
    },

    detail: async (req, res, next) => {
        console.log('GET user detail');
        const userId = req.user.id;
        const detail = await Detail.findOne({user: userId});
        if (!detail) {
            return res.status(403).json({})
        };
        detail.populate('user')
            .execPopulate( async (err, detail) => {
                console.log(JSON.stringify(detail, null, "\t"));
                res.status(200).json(detail)
            })
    },
    collectNecessaryDetails: async (req, res, next) => {
        console.log('Collect full-detail');
        const userData = req.value.body;
        // Set birthDate data format
        if (userData.birthDate) {
            const bD = userData.birthDate;
            const bY = bD.year, bM = bD.month, bd = bD.day;
            userData.birthDate = new Date(bY, bM, bd)
        };

        const userId = req.user.id;
        const detailExist = await Detail.findOne({user: userId});
        if (detailExist) {
            console.log(detailExist);
            return res.status(409).json({
                error: 'User detail already collected'
            })
        };

        userData.user = userId;
        // Create user details
        await Detail.create(userData, async (err, detail)=> {
            if (err) {
                return res.status(403).json({error: err})
            };
            console.log('Created user detail');
            detail.populate('user')
                    .execPopulate( async (err, detail) => {
                        // Update user details field
                        await User.findByIdAndUpdate(userId, { detail: detail.id }, {new: true, useFindAndModify: false });
                        //console.log(JSON.stringify(detail, null, "\t"));
                        res.status(200).json(detail)
                    })
        });
    },
    updateDetails: async (req, res, next) => {
        console.log('Update detail');
        const userData = req.value.body;
        // Set birthDate data format
        if (userData.birthDate) {
            const bD = userData.birthDate;
            const bY = bD.year, bM = bD.month, bd = bD.day;
            userData.birthDate = new Date(bY, bM, bd)
        };

        const userId = req.user.id;
        const detailExist = await Detail.findOne({user: userId});
        if (!detailExist) {
            return res.status(404).json({
                error: 'User detail does not exist'
            })
        };

        userData.user = userId;
        Detail.findOneAndUpdate({user: userId}, userData, {new: true, useFindAndModify: true}, async (err, detail) => {
            if (err) {
                return res.status(403).json({error: err})
            };
            res.status(200).json({detail: detail})
        })
    },
    updatePhoneNo: async (req, res, next) => {
        console.log('PATCH user phone number');
        const userData = req.value.body;
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, userData, {new: true, useFindAndModify: false}, async (err, user) => {
            if (err) {
                return res.status(403).json({error: err})
            };
            res.status(200).json({updatedUser: user})
        })
    },
    updatePin: async (req, res, next) => {
        console.log('PATCH user pin');
        const userData = req.value.body;
        const userId = req.user.id;

        // Check if user exist
        const user = await User.findById(userId);

        if (!user) {
            return res.status(403).json({error: "user does not exist"})
        };

        user.pin = userData.pin;
        await user.save();

        res.status(200).json({updatedUser: user})
    }
}