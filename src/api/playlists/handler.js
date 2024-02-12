class PlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: owner } = request.auth.credentials;

        const playlistId = await this._service.addPlaylist({
            name, owner,
        });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;

    }

    async getPlaylistHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._service.getPlatlist(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }
    
    async deletePlaylistHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.creddentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistId(id);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}


module.exports = PlaylistHandler;