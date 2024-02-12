/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlist_songs_activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'TIMESTAMP',
            notNull: true,
        },
    });

    pgm.createIndex('playlist_songs_activities', ['playlist_id', 'song_id', 'user_id']);
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_songs_activities');
};
