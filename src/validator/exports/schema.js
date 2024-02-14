const Joi = require('joi');

const ExportSongsPayLoadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true}).required(),
});

module.exportss = ExportSongsPayLoadSchema