const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pin: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 4
    },
    details: {
        firstName: {
            type: String,
            default: null,
            trim: true
        },
        middleName: {
            type: String,
            default: null,
            trim: true
        },
        lastName: {
            type: String,
            default: null,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            default: null,
            trim: true
        },
        gender: {
            male: {
                type: Boolean,
                default: null
            },
            female: {
                type: Boolean,
                default: null
            }
        },
        birthDate: {
            type: Date,
            default: null
        },
        address: {
            type: String,
            default: null,
            trim: true
        },
        bvn: {
            type: String,
            default: null,
            trim: true
        },
        employmentStatus: {
            jobTitle: {
                type: String,
                default: null
            }
        }
    }
}, {
    timestamps: true,
});


userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(this.pin, salt)
        //console.log('salt:', salt);
        //console.log('normal pin:', this.pin);
        //console.log('hashed pin:', pinHash);

        this.pin = pinHash;
        next()
    } catch(err) {
        next(err)
    }
});

userSchema.methods.isValidPin = async function (enteredPin) {
    try {
        return await bcrypt.compare(enteredPin, this.pin)
    } catch (err) {
        throw new Error(err)
    }
};


const User = mongoose.model('User', userSchema);


module.exports = User