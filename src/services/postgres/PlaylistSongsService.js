const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSong(playlistId, {songId}) {
        const id = `playlistSong-${nanoid(16)}`;

        const query = {
            text:  'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            val: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
    }

    async getPlaylistSong(playlistId) {
        const query = {
            text: `SELECT A.id, A.name, B.username FROM playlists A LEFT JOIN users B ON B.id = A.owner WHERE A.id = $1`,
            values: [playlistId],
        };

        let result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');

        }

        const querySong = {
            text: `SELECT C.id, C.title, C.performer FROM playlists A JOIN playlist_songs B ON B.playlist_id = A.id JOIN songs C ON C.id = B.song_id WHERE A.id = $1`,
            values: [playlistId],
        };


        result = await this._pool.query(querySong);
        const playlist = result.rows[0];

        playlist.songs = result.rows;

        return playlist
    }

    async deletePlaylistSong(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(querySong);

        if(!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
        }
    }
}


module.exports = PlaylistSongsService;