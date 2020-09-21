const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const superUserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
});


superUserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt)
        //console.log('salt:', salt);
        //console.log('normal password:', this.password);
        //console.log('hashed password:', passwordHash);

        this.password = passwordHash;
        next()
    } catch(err) {
        next(err)
    }
});

superUserSchema.methods.isValidPassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password)
    } catch (err) {
        throw new Error(err)
    }
};


const superUser = mongoose.model('superUser', superUserSchema);


module.exports = superUser