require('dotenv').config();
const path = require('path');

const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const Jwt = require('@hapi/jwt');

// Album
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require ('./validator/albums');

// Song
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require ('./validator/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require ('./validator/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Playlist
const playlist = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistsServices');
const PlaylistValidator = require('./validator/playlists');

// Playlist Songs
const playlistSongs = require('./api/playlistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsSongs');

// playlist songs activities
const playlistSongActivities = require('./api/playlistSongActivities');
const PlaylistSongsActivitiesService = require('./services/postgres/PlaylistSongsActivitiesService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');  

// Exports 
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const init = async () => {
    const albumService = new AlbumService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService();
    const playlistService = new PlaylistService(collaborationsService);
    const playlistSongService = new PlaylistSongsService();
    const playlistSongsActivitiesService = new PlaylistSongsActivitiesService();

    const server = Hapi.server({
      port: 5000,
      host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });

    // registrasi plugin eksternal
    await server.register([
      {
        plugin: Jwt,
      }
    ]);

    // mendefinisikan strategy autentikasi jwt

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
          aud: false,
          iss: false,
          sub: false,
          maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
          isValid: true,
          credentials: {
            id: artifacts.decoded.payload.id,
          },
        }), 
    });
    await server.register([
        {
            plugin : albums,
            options: {
                service: albumService,
                validator: AlbumValidator,
            },
        },
        {
            plugin : songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
          plugin : users,
          options: {
            service: usersService,
            validator: UsersValidator,
          },
        },
        {
          plugin: authentications,
          options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
          },
        },
        {
          plugin: collaborations,
          options:{
            collaborationsService,
            playlistService,
            usersService,
            validator: CollaborationsValidator,
          },
        },

        {
          plugin: playlist,
          options: {
            service: playlistService,
            validator: PlaylistValidator,
          },
        },
        {
          plugin: playlistSongs,
          options: {
            playlistService,
            songsService,
            playlistSongService,
            playlistSongsActivitiesService,
            validator: PlaylistSongsValidator,
          },
        },
        {
          plugin: playlistSongActivities,
          options: {
            playlistService,
            playlistSongsActivitiesService,
          },
        },
        {
          plugin: _exports,
          options: {
            service: ProducerService,
            playlistService,
            validator: ExportsValidator
          }
        },

    ]);
  
    server.ext('onPreResponse', (request, h) => {
      // mendapatkan konteks response dari request
      const { response } = request;
  
      if (response instanceof Error) {

        // penanganan client error secara internal.
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }
  
        // mempertahankan penanganan client error oleh hapi secara native.
        if (!response.isServer) {
          return h.continue;
        }
  
        // penanganan server error sesuai kebutuhan
        console.log(response)
        const newResponse = h.response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        });
        newResponse.code(500);
        return newResponse;
      }
  
      // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
      return h.continue;
    });
  
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
    console.log("PGHOST value :", process.env.PGHOST);

  };
   
  init();