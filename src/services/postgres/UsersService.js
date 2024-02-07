const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../..//exceptions/AuthenticationError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async addUser ({ username, password, fullname}) {
        await this.verifyNewUsername(username);
        // TODO: Bila verifikasi lolos, maka masukkan user baru ke database.

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        };
        try {
            const result = await this._pool.query(query);
    
            // Cek apakah proses input berhasil
            if (result.rows.length === 0) {
                throw new InvariantError('User gagal ditambahkan');
            }
    
            return result.rows[0].id;
        } catch (error) {
            if (error.constraint === 'users_username_key') {
                // If the error is due to a duplicate username, provide a specific error message
                throw new InvariantError('Username sudah digunakan');
            }
    
            // Handle other errors or rethrow the original error
            throw error;
        }
    }

    async verifyNewUsername(username) {
        // TODO: Verifikasi username, pastikan belum terdaftar.
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);
 
        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }
    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };
        
        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        };
        const result = await this._pool.query(query);

        if(!result.rows.length) {
            throw new AuthenticationError('Kredensial yang anda berikan salah');
        }

        const { id, password: hashedPassword } = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthenticationError('Kredensial yang anda berikan salah');
        }

        return id;
        }   
}

module.exports = UsersService;