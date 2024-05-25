class UserAlbumLikesHandler {
    constructor(userAlbumLikesService, albumService) {
        this._userAlbumLikeService = userAlbumLikesService;
        this._albumService = albumService;

        this.postUserAlbumLikeHandler = this.postUserAlbumLikeHandler.bind(this);
        this.getUserAlbumLikeHandler = this.getUserAlbumLikeHandler.bind(this);
        this.deleteUserAlbumLikeHandler = this.deleteUserAlbumLikeHandler.bind(this);
    }

    async postUserAlbumLikeHandler( request, h) {
        const { id: userId } = request.auth.credentials;
        const { id: albumId } = request.params;
        await this._albumService.verifyExistAlbum(albumId);
        // await this._albumService.getAlbumById(albumId);
        await this._userAlbumLikeService.verifyAlbumLike(userId, albumId);
        await this._userAlbumLikeService.likeAlbum(userId, albumId);


        const response = h.response({
            status: 'success',
            message: 'Berhasil like album',
        });
        response.code(201);
        return response;
    }

    async getUserAlbumLikeHandler(request, h) {
        const { id } = request.params;
        await this._albumService.getAlbumById(id);

        const { likes, from } = await this._userAlbumLikeService.getAlbumLike(id);

        if(from === 'cache') {
            const response = h.response ({
                status: 'success',
                data: {
                    likes: likes,
                },
            });

            response.code(200);
            response.header('X-Data-Source', 'cache');
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                likes,
            },
        });

        response.code(200);
        return response;
    }

    async deleteUserAlbumLikeHandler(request) {
        const { id: albumId } = request.params
        const { id: userId } = request.auth.credentials;
        await this._userAlbumLikeService.unlikeAlbum(userId, albumId);

        return {
            status: 'success',
            message: 'album batal di like',
        }
    }

}

module.exports = UserAlbumLikesHandler;