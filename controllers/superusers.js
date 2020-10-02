const JWT = require('jsonwebtoken');
const { User, Detail } = require('../models/user.model');
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

    users: async (req, res, next) => {
        console.log('users data');
        const users = await User.find();
        res.status(200).json({ users: users })
    },
    user: async (req, res, next) => {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(403).json({})
        };
        res.status(200).json({ user: user })
    },

    usersDetail: async (req, res, next) => {
        console.log('details data');
        const details = await Detail.find();
        res.status(200).json({ usersDetail: details })
    },
    userDetail: async (req, res, next) => {
        console.log('A user\'s details data');
        const detail = await Detail.findOne({user: req.params.userId});
        if (!detail) {
            return res.status(200).json({})
        };
        res.status(200).json({ userDetail: detail })
    },

    updateAUserDetails: async (req, res, next) => {
        const userData = req.value.body;
        // Set birthDate data format
        if (userData.birthDate) {
            const bD = userData.birthDate;
            const bY = bD.year, bM = bD.month, bd = bD.day;
            userData.birthDate = new Date(bY, bM, bd)
        };

        const userId = req.params.id;
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
    updateAUserPhoneNo: async (req, res, next) => {
        const userData = req.value.body;
        const userId = req.params.id;

        await User.findByIdAndUpdate(userId, userData, {new: true, useFindAndModify: false}, async (err, user) => {
            if (err) {
                return res.status(403).json({error: err})
            };
            res.status(200).json({updatedUser: user})
        })
    },
    updateAUserPin: async (req, res, next) => {
        const userData = req.value.body;
        const userId = req.params.id;

        // Check if user exist
        const user = await User.findById(userId);

        if (!user) {
            return res.status(403).json({error: "user does not exist"})
        };

        user.pin = userData.pin;
        await user.save();

        res.status(200).json({updatedUser: user})
    },

    deleteUser: async (req, res, next) => {
        const userId = req.params.id;
        const user = await User.findById(req.params.id, async (err, user) => {
            if (err) {
                return res.status(404).json({error: err})
            }
        });
        if (!user) {
            return res.status(404).json({error: "use not found"})
        };
        user.populate('detail').execPopulate();
        await User.findByIdAndDelete(user.id, async (err, doc) => {
            if (err) {
                return res.status(404).json({error: err})
            };
            //console.log(`deleted user by id ${user.id}:`, JSON.stringify(user, null, "\t"));
            await Detail.findOneAndDelete({user: user.id}, (err, doc) => {
                if (err) {
                    return res.status(404).json({error: err})
                }
            });
            res.status(200).json({deletedUser: user});
        })
    },
    deleteUsers: async (req, res, next) => {
        await User.deleteMany({}, async (err, userDocCount) => {
            if (err) {
                return res.status(403).json({error: err})
            };

            await Detail.deleteMany({}, (err, detailDocCount) => {
                if (err) {
                    return res.status(404).json({error: err})
                };
                //console.log(`user doc count:`, JSON.stringify(userDocCount, null, "\t"));
                res.status(200).json({"deleteAction": `Deleted ${userDocCount.n} users & with ${detailDocCount.deletedCount} of user details document`})
            });
        });
    }
}