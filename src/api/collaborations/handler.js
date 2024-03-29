class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, usersService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h ){
        this._validator.validateCollaborationPayload(request.payload);
        const { playlistId, userId} = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._usersService.getUserById(userId);

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

        const response = h.response({
            status: 'success',
            data: {
                collaborationId,
            },
        });

        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);
        const { playlistId, userId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaboration(playlistId, userId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menghapus collaboration',
        });
        response.code(200);
        return response;
    }
}

module.exports = CollaborationsHandler;