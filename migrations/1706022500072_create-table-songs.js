exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'INTEGER',
          notNull: true,
        },
        performer: {
          type: 'TEXT',
          notNull: true,
        },
        genre: {
          type: 'TEXT',
          notNull: true,
        },
        duration: {
          type: 'INTEGER',
          notNull: true,
        },
        "albumId": {
          type: 'TEXT',
          notNull: true,
        },
      });
      
      pgm.addConstraint(
        'songs',
        'fk_songs_albumId_albums_id',
        'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE',
      );
};

exports.down = pgm => {
    pgm.dropTable('songs'); 
};
