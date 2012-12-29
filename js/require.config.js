var require = {
        baseUrl: './js',
        paths: {
            'fabric': 'lib/fabric.min',
            'underscore': 'lib/lodash.min',
            'kinetic': 'lib/kinetic-v4.2.0.min'
        },
        shim: {
            // Libraries
            // ----------------------------------------------- //
            'fabric': {
                deps: [],
                exports: 'fabric'
            },
        }
    }