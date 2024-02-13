const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsSongPayLoadSchema } = require('./schema');  

const PlaylistSongsValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistsSongPayLoadSchema.validate(payload);

        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;