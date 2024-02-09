const { pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

const collaborationsService = {
    constructor() {
        this._pool = new pool();
    },

    async addCollaboration(playlistId, userid) {
        const id= `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userid],
        };

        if(!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }

        return result.rows[0].id;
    },

    async deleteCollaboration(playlistId, userid) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userid],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('kolaborasi gagal dihapus')
        }
    },

    async verifyCollaborator(playlistId, userid) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userid],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal diverifikasi');
        }

    }
};

    module.exports = collaborationsService;