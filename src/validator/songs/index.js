const { SongPayloadSchema, QueryPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
    validateSongPayload: (payload) => {
      const validationResult = SongPayloadSchema.validate(payload);
      if (validationResult.error) throw new InvariantError(validationResult.error.message);
    }, 
    validateQueryPayloadSchema : ( query ) => {
      const validationResult = QueryPayloadSchema.validate(query);
      if(validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    }  
  };


module.exports = SongsValidator;