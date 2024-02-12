const Joi = require('joi');

const PlaylistPayLoadSchema = Joi.object({
    name: Joi.string().required(),
});

module.exports = { PlaylistPayLoadSchema };