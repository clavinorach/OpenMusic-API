const ExportPlaylistPayLoadSchema = require ('./schema');
const InvariantError = require ('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportPlaylistPayload: (payload) => {
        const validationResult = ExportPlaylistPayLoadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator; 