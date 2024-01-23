require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// Album
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');

// Song
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

const {AlbumValidator, SongValidator} = require {'./validator/musics'}

const init = async () => {
    const albumService = new AlbumService();
    const songsService = new SongsService();

    const server = Hapi.server({
      port: process.env.PORT,
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
                validator: SongValidator,
            },
        },
    ])
  
    server.ext('onPreResponse', (request, h) => {
      // mendapatkan konteks response dari request
      const { response } = request;
    
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
        
      return h.continue;
    });
   
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  };
   
  init();