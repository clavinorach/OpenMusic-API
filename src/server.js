require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// Album
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');

// Song
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const {AlbumValidator, SongsValidator} = require ('./validator/songs')

const init = async () => {
    const albumService = new AlbumService();
    const songsService = new SongsService();

    const server = Hapi.server({
      port: 5000,
      host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
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
    ])
  
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