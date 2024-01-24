/* eslint-disablee require-jsdoc */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration, AlbumId}) {
        const id = `song-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: {id, title, year, genre, performer, duration, AlbumId},
        };

        const res = await this._pool.query(query);
        if(!res.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return res.rows[0].id;;
    }

    async getSongs() {
        const res = await this._pool.query('SELECT * FROM songs');
        return res.rows.map(MapDBToModel);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const res = await this._pool.query(query);

        if(!res.rowCount) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return res.rows.map(MapDBToModel)[0];
    }

    async editSongById(id, {title, performer, genre}) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: {title, year, performer, genre, duration, updatedAt, id},
        };

        const res = await this._pool.query(query);

        if(!res.rowCount) {
            throw new NotFoundError('Gagal memperbaharui lagu, Id tidak ditemukan');
        }
    }

    async deleteSongById (id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const res = await this._pool.query(query);
        
        if(!res.rowCount) {
            throw new NotFoundError('Album gagal dihapus, Id tidak ditemukan');
        }
    }
}

module.exports = SongsService;