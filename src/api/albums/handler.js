class AlbumHandler {
    constructor(service, validator, storageService) {
        this._service = service
        this._validator = validator;
        this._storageService = storageService;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.addAlbum(request.payload);
    
    const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
            albumId,
        },
    });
    response.code(201);
    return response;    
}
    

    async getAlbumByIdHandler(request, h) {
        const { id } = request.params;
        
        const album = await this._service.getAlbumById(id);
        album.coverUrl = (album.coverUrl) ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${album.coverUrl}` : null;
    
        const response = h.response({
            status: 'success',
            data: {
                album: album
            },
        });
        
        response.code(200);
        return response;
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;
        await this._service.editAlbumById(id, request.payload);
    
        return {
        status: 'success',
        message: 'Album berhasil diperbarui',
        };
    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);

        return {
            status: 'success',
            message: 'Album berhasil dihapus',
        };
    }


}
    module.exports = AlbumHandler;