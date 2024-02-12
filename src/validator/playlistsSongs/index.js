const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSongPayLoadSchema } = require('./schema');  

const PlaylistSongsValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayLoadSchema.validate(payload);

        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;