class UploadsHandler {
    constructor(storageService, albumService, validator) {
        this._storageService = storageService;
        this._albumService = albumService;
        this._validator = validator;

        this._postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
    }

    async postUploadAlbumCoverHandler(request, h) {
        const { id: albumId } = request.params;
        const { cover } = request.payload;
        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        await this._albumService.updateAlbumCover(albumId, filename);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil disimpan',
            data: {
                fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
            }
        });
        response.code(201);
        return response;

    }
}

module.exports = UploadsHandler;