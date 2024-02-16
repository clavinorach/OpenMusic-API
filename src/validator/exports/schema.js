const Joi = require('joi');

const ExportPlaylistPayLoadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true}).required(),
});

module.exportss = ExportPlaylistPayLoadSchema