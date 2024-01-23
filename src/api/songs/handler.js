/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */

class SongsHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator;

        this.postSongHandler = this.postSongHandler(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongsByIdHandler = this.putSongsByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const {
        title , year, genre, performer, duration, insertedAt,
    } = request.payload;
    const songId = await this._service.addSong({
        title, year, performer, genre, duration, insertedAt,
    });
    const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
            songId,
        },
    });
    response.code(201);
    return response;    
}
    
    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async getSongByIdHandler(request) {
        const { id } = request. params;
        const song = await this._service.getSongById(id);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    putSongByIdHandler(request) {
        this.validator.validateSongPayload(request.payload);
        // const {
        //     tittle, year, performer, genre, duration,
        // } = request.payload;
        const { id } = request.params;
        await this._service.editSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil diperbaharui'
        };
    }

    async deleteSongByIdHandler(request) {
        const {id} = request.params;
        await this._service.deleteSongById(id);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

    module.exports = SongsHandler;