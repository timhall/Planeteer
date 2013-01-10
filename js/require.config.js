var require = {
        baseUrl: './js',
        paths: {
            'underscore': 'lib/lodash.min',
            'kinetic': 'lib/kinetic-v4.2.0.min',
            'backbone': 'lib/backbone-min'
        },
        shim: {
            // Libraries
            // ----------------------------------------------- //
            'backbone': {
                deps: ['underscore'],
                exports: 'Backbone'
            }
        }
    }