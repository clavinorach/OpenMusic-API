const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async likeAlbum(userId, albumId) {
        const id = `user-album-like${nanoid(16)}`;

        const query = {
            text: `INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id`,
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0]) {
            throw new InvariantError('Gagal menambahkan like');
        }

        await this._cacheService.delete(`album-like:${albumId}`);
        return result.rows[0].id   
    }

    async unlikeAlbum(userId, albumId) {
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('User gagal unlike album');
        }

        await this._cacheService.delete(`album-like:${albumId}`);
    }

    async getAlbumLike(albumId) {
        try {
            const result = await this._cacheService.get(`album-like:${albumId}`);
            return {
                likes: JSON.parse(result),
                from: 'cache',
            };
        } catch {
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
                values: [albumId],
            };

            const result = await this._pool.query(query);

            await this._cacheService.set(`album-like:${albumId}`, JSON.stringify(result.rows.length), 1800);
            return {
                likes: result.rowCount,
            };
        }
    }

    async verifyAlbumLike(userId, albumId) {
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);
        if(result.rowCount) {
            throw new InvariantError('album sudah disukai');
        }
    }
}

module.exports = UserAlbumLikesService;