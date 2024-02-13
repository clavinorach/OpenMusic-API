const Joi = require('joi');

const PlaylistsSongPayLoadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistsSongPayLoadSchema};