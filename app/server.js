'use strict';

var Hapi = require('hapi'),
    Inert = require('inert');

var DEFAULT_PORT = 4001;
var PUBLIC_DIR = "./public";

var server = new Hapi.Server();

server.register(Inert, function () {
    server.connection({
        port: process.env.PORT || DEFAULT_PORT
    });

    server.route({
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
              path: PUBLIC_DIR
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            file: PUBLIC_DIR + "/index.html"
        }
    });
});

server.start(function(err) {
    if (err) {
      throw err
    }
    console.log('Server started at port ' + server.info.port);
});
