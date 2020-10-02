const joi = require('joi');

module.exports = {
    validateUserBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                return res.status(400).json(result.error)
            };
            
            if (!req.value) { req.value = {} };
            req.value['body'] = result.value;
            next()
        }
    },
    validateSuperUserBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                return res.status(400).json(result.error)
            };
            
            if (!req.value) { req.value = {} };
            req.value['body'] = result.value;
            next()
        }
    },

    schemas: {
        userAuth: joi.object().keys({
            phoneNo: joi.string()
                .pattern(new RegExp('[0-9]'))
                .required(),
            pin: joi.string()
                .pattern(new RegExp('[0-9]'))
                .min(4)
                .max(4)
                .required()
        }),
        userPhoneNo: joi.object().keys({
            phoneNo: joi.string()
                .pattern(new RegExp('[0-9]'))
                .required()
        }),
        userPin: joi.object().keys({
            pin: joi.string()
                .pattern(new RegExp('[0-9]'))
                .min(4)
                .max(4)
                .required()
        }),
        userDetailInit: joi.object().keys({
            firstName: joi.string()
                        .required(),
            lastName: joi.string()
                        .required(),
            middleName: joi.string(),
            email: joi.string()
                .email()
                .required(),
            gender: joi.object({
                male: joi.boolean().falsy(),
                female: joi.boolean().falsy()
            }).required(),
            birthDate: joi.object({
                year: joi.number()
                    .integer(),
                month: joi.number()
                    .integer()
                    .min(1)
                    .max(12),
                day: joi.number()
                .integer()
                .min(1)
                .max(31)
            }).required(),
            address: joi.string()
                    .required(),
            bvn: joi.string()
                    .required(),
            employmentStatus: joi.object({
                jobTitle: joi.string()
            }).required()
        }),
        userDetail: joi.object().keys({
            firstName: joi.string(),
            lastName: joi.string(),
            middleName: joi.string(),
            email: joi.string()
                .email(),
            gender: joi.object({
                male: joi.boolean().falsy().required(),
                female: joi.boolean().falsy().required()
            }),
            birthDate: joi.object({
                year: joi.number()
                    .integer(),
                month: joi.number()
                    .integer()
                    .min(1)
                    .max(12),
                day: joi.number()
                .integer()
                .min(1)
                .max(31)
            }),
            address: joi.string(),
            bvn: joi.string(),
            employmentStatus: joi.object({
                jobTitle: joi.string()
            })
        }),

        superUserAuth: joi.object().keys({
            username: joi.string()
                .required(),
            password: joi.string()
                .required()
        })
    }
}