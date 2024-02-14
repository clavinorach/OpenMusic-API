class ExportsHandler {
    constructior(service, validator) {
        this._service = service;
        this._validator = validator;
    }

    async postExportPlaylistsHandler(request, h) {
        this._validator.validateExportPlaylistsPayload(request.payload);

        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);

        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage('export:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan anda sedang kami proses',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;