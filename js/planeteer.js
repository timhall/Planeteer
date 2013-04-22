(function (cosmic, freebody, Planet, Ship, Destination) {

    cosmic.environment.bounds.width *= 2;
    cosmic.environment.bounds.height *= 2;
    
    // Set up ship and planets
    var ship = [
        new Ship({
            color: 'yellow',
            radius: 20,
            mass: 1000,
            x: 50,
            y: 50,
            name: 'Fighter'
        })
    ];
    
    var planets = [
        new Planet({
            color: '#6BCAF3',
            radius: 70,
            mass: 10000000000000000,
            x: 250,
            y: 700,
            image: 'blue',
            name: 'Neptune'
        }),
        new Planet({
            color: '#F16122',
            radius: 100,
            mass: 20000000000000000,
            x: 950,
            y: 500,
            image: 'orange',
            name: 'Jupiter'
        })
    ];
    
    var destinations = [
        new Destination({
            color: null,
            radius: 70,
            x: 850,
            y: 800,
            name: 'Destination'
        })    
    ]
    
    // Add ship and planets
    for (var i = 0; i < planets.length; i++) {
        cosmic.environment.addPlanet(planets[i]);
    }
    for (var i = 0; i < destinations.length; i++) {
        cosmic.environment.addObject(destinations[i]);
    }
    for (var i = 0; i < ship.length; i++) {
        cosmic.environment.addBody(ship[i]);
    }
    
    // Setup camera
    var camera = new cosmic.KineticCamera('experiment');
    camera.scale = 0.5;
    camera.viewSize = { x: 1600, y: 1200 }
    camera.defaults = {
        scale: 0.5,
        position: { x: 0, y: 0 },
        following: null
    };
    
    // Add layers
    camera.layer('background', cosmic.background.objects);
    //camera.layer('paths', cosmic.paths.objects);
    camera.layer('foreground', cosmic.environment.objects);
    camera.layer('interface', cosmic.ui.objects)
    
    // Set camera in cosmic
    cosmic.camera = camera;
    
    // DEBUG
    window.cosmic = cosmic;
    window.camera = cosmic.camera;
    window.environment = cosmic.environment;
    window.ship = ship;
    window.planets = planets;
    window.destinations = destinations;
    
    cosmic.reset = function () {
        _.each(cosmic.environment.objects, function (object) {
            object.x = Math.floor(Math.random()*1400 + 100);
            object.y = Math.floor(Math.random()*1200 + 100);
            cosmic.camera.reset();
            cosmic.iteration += 1;
            console.log(cosmic.iteration);
        })
    };
    
    // Subscribe to events
    cosmic.hub.on('touchstart', function (e) {
        cosmic.playback.pause();
    })
    cosmic.hub.on('touchend', function (e) {
        cosmic.playback.unpause();  
    });

    // Start planeteer
    console.log('Starting Planeteer');
    cosmic.playback.pause();
    cosmic.playback.start(true);

})(cosmic, freebody, Planet, Ship, Destination);
