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
}) => ({
    id,
    name,
    year,
    songs,
});

module.exports = { SongModel, AlbumModel};