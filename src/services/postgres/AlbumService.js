const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { AlbumModel } = require('../../utils/model');

class AlbumService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({name, year}) {
        const id = `album-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const res = await this._pool.query(query);

        if (!res.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }
    
        return res.rows[0].id;
    }
 
    async getAlbumById(id) {
        const query = {
            text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
            values: [id],
        };
        
        const res = await this._pool.query(query);

        if (!res.rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }
        const album = res.rows[0];

        const querySong = {
            text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
            values: [album.id],
        };

        const songs = await this._pool.query(querySong);

        if(songs.rowCount) {
            album.songs = songs.rows
        }

        return AlbumModel(album);
    }

    async editAlbumById(id, {name, year}) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id],
        };

        const res = await this._pool.query(query);

        if(!res.rowCount) {
            throw new NotFoundError('Gagal memperbaharui album, Id tidak ditemukan');
        }
    }

    async deleteAlbumById (id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const res = await this._pool.query(query);
        
        if(!res.rowCount) {
            throw new NotFoundError('Album gagal dihapus, Id tidak ditemukan');
        }
    }

    async updateAlbumCover(id, coverUrl) {
        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [coverUrl, id],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Album gagal diperbarui, album id tidak ditemukan');
        }
    }

    async verifyExistAlbum(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if(!result.rowCount) {
            throw new NotFoundError('Data album tidak ditemukan');
        }
    }
}

module.exports = AlbumService;