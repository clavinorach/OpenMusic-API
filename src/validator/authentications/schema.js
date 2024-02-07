const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object ({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const PutAuthenticationPayloadschema = Joi.object ({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object ({
    refreshToken: Joi.string().required(),
})

module.exports = {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadschema,
    DeleteAuthenticationPayloadSchema,
}