const SongModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: album_id,
});

const AlbumModel = ({
    id,
    name,
    year,
    songs,
    cover,
}) => ({
    id,
    name,
    year,
    songs,
    coverUrl: cover,
});

module.exports = { SongModel, AlbumModel};