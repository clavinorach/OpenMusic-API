class UploadsHandler {
    constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        this._postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
    }

    async postUploadAlbumCoverHandler(request, h) {
        const { id } = request.params;
        const { cover } = request.payload;
        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/cover/${filename}`;

        await this._albumsService.updateAlbumCover(id, coverUrl);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil disimpan',
        });
        response.code(201);
        return response;

    }
}

module.exports = UploadsHandler;