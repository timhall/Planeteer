require(
['cosmic', 'freebody', 'cosmic/KineticCamera', 'Planet.new', 'Ship', 'Destination', 'cosmic/environment'],
function (cosmic, freebody, KineticCamera, Planet, Ship, Destination, environment) {

    environment.bounds.width *= 2;
    environment.bounds.height *= 2;
    
    // Set up ship and planets
    var ship = [
        new Ship({
            color: 'yellow',
            radius: 20,
            mass: 1000,
            x: 50,
            y: 50
        })
    ];
    
    var planets = [
        new Planet({
            color: 'blue',
            radius: 70,
            mass: 10000000000000000,
            x: 300,
            y: 430,
            image: 'blue'
        }),
        new Planet({
            color: 'orange',
            radius: 100,
            mass: 20000000000000000,
            x: 600,
            y: 700,
            image: 'orange'
        })
    ];
    
    var destinations = [
        new Destination({
            color: null,
            radius: 50,
            x: 1000,
            y: 800
        })    
    ]
    
    // Add ship and planets
    for (var i = 0; i < planets.length; i++) {
        cosmic.environment.addPlanet(planets[i]);
    }
    for (var i = 0; i < destinations.length; i++) {
        cosmic.environment.addDestination(destinations[i]);
    }
    for (var i = 0; i < ship.length; i++) {
        cosmic.environment.addBody(ship[i]);
    }
    
    // Setup camera
    var camera = new KineticCamera('experiment');
    camera.scale = 0.5;
    
    
    // Add layers
    camera.layer('foreground', cosmic.environment.objects);
    camera.layer('interface', cosmic.ui.objects)
    // camera.layer('background', ...);    
    
    // Set camera in cosmic
    cosmic.camera = camera;
    
    // DEBUG
    window.cosmic = cosmic;
    window.camera = cosmic.camera;
    window.environment = cosmic.environment;
    window.ship = ship;
    window.planets = planets;
    window.destinations = destinations;
    
    // Start experiment:
    console.log('Starting experiment');
    cosmic.start();
    cosmic.envPause();
    console.log(cosmic.time);
});



















