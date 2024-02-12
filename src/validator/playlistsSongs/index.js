const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayLoadSchema } = require('./schema');  

const PlaylistSongsValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistPayLoadSchema.validate(payload);

        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;