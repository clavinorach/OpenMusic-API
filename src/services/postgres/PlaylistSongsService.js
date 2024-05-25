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
            text:  'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
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
        
        const playlist = result.rows[0];
        
        const querySong = {
            text: `SELECT C.id, C.title, C.performer FROM playlists A JOIN playlists_songs B ON B.playlist_id = A.id JOIN songs C ON C.id = B.song_id WHERE A.id = $1`,
            values: [playlistId],
        };


        result = await this._pool.query(querySong);

        playlist.songs = result.rows;
    
        return playlist;
    }

    async deletePlaylistSong(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this._verifyPlaylistOnwer(playlistId, userId);
        } catch(error) {
            if( error instanceof NotFoundError) {
                throw error;
            }
            try{
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}


module.exports = PlaylistSongsService;