(function (cosmic, freebody, Planet, Ship, Destination) {

    cosmic.environment.bounds.width *= 6;
    cosmic.environment.bounds.height *= 6;
    
    var states = {
        level1: {
            ship: { x: 150, y: 150 },
            neptune: { x: 1000, y: 2100 },
            jupiter: { x: 3100, y: 830 },
            sun: { x: 2400, y: 1800 },
            destination: { x: 2000, y: 2800 }
        }
    }
    
    // Set up ship and planets
    var ships = [
        new Ship({
            color: 'yellow',
            radius: 30,
            mass: 1000,
            //x: 150,
            //y: 150,
            name: 'Fighter'
        })
    ];
    
    var planets = [
        new Planet({
            color: '#6BCAF3',
            radius: 80,
            mass: 10000000000000000 * 8,
            //x: 1000,
            //y: 2100,
            image: 'blue',
            name: 'Neptune'
        }),
        new Planet({
            color: '#F16122',
            radius: 110,
            mass: 20000000000000000 * 8,
            //x: 3100,
            //y: 830,
            image: 'orange',
            name: 'Jupiter'
        }),
        new Planet({
            color: 'yellow',
            radius: 250,
            mass: 40000000000000000 * 8,
            //x: 2400,
            //y: 1800,
            image: 'star',
            name: 'Sun',
            movable: false
        })
    ];
    
    var destinations = [
        new Destination({
            color: null,
            radius: 100,
            //x: 2000,
            //y: 2800,
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
    for (var i = 0; i < ships.length; i++) {
        cosmic.environment.addBody(ships[i]);
        
        // Setup paths
        cosmic.paths.track(ships[i]);
    }
    
    var setState = function (state) {
        // Ship
        var ship = ships[0];
        ship.x = state.ship.x;
        ship.y = state.ship.y;
        ship.v = new freebody.Vector();
        ship.a = new freebody.Vector();
        
        // Planets
        var neptune = planets[0],
            jupiter = planets[1],
            sun = planets[2];
        
        neptune.x = state.neptune.x;
        neptune.y = state.neptune.y;
        jupiter.x = state.jupiter.x;
        jupiter.y = state.jupiter.y;
        sun.x = state.sun.x;
        sun.y = state.sun.y;
        
        // Destination
        var destination = destinations[0];
        
        destination.x = state.destination.x;
        destination.y = state.destination.y;
        
        cosmic.paths.update();
    }
    var restart = cosmic.playback.restart = function () {
        setState(states.level1);    
    }
    
    
    // Setup camera
    var camera = new cosmic.KineticCamera('game');
    camera.scale = 5/24;
    camera.viewSize = { x: 4800, y: 3600 }
    camera.defaults = {
        scale: 0.5,
        position: { x: 0, y: 0 },
        following: null
    };
    
    // Add layers
    camera.layer('background', cosmic.background.objects);
    camera.layer('paths', cosmic.paths.objects);
    camera.layer('foreground', cosmic.environment.objects);
    camera.layer('interface', cosmic.ui.objects)
    
    // Set camera in cosmic
    cosmic.camera = camera;
    
    // DEBUG
    window.cosmic = cosmic;
    window.camera = cosmic.camera;
    window.environment = cosmic.environment;
    window.ships = ships;
    window.planets = planets;
    window.destinations = destinations;
    
    // Subscribe to events
    cosmic.hub.on('touchstart', function (e, selection) {
        if (selection 
            && selection.type !== 'PlayPauseButton'
            && selection.type !== 'Ship') {
            cosmic.playback.pause();
        }
    })
    cosmic.hub.on('touchend', function (e) {
        //cosmic.playback.unpause();  
    });
    cosmic.hub.on('collision', function (A, B) {
        if (A.options.type === 'Destination' || B.options.type === 'Destination') {
            cosmic.playback.pause();
        } else {
            cosmic.paths.update();
        } 
    });
    
    /*
    var meter = new FPSMeter(undefined, {
        maxFps: 30,
        theme: 'colorful',
        top: 'auto', right: '5px', bottom: '5px', left: 'auto',
        heat: true,
        graph: true, history: 20
    });
    cosmic.hub.on('playback:render', meter.tick);
    */
    
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            // Pause / unpause on spacebar
            cosmic.playback.toggle();
            e.preventDefault();
        }
    });
    
    var win = function () {
        cosmic.ui.objects[1].display.attrs.stat = 'Win';
        cosmic.playback.pause();
        console.log('Win!');
        
    };
    
    var lose = function () {
        cosmic.ui.objects[1].display.attrs.stat = 'Fail';
        cosmic.playback.pause();
        console.log('Lose!');
    }
    
    cosmic.hub.on('path:intersect:destination', function (point) {
        console.log('You win!');
        //cosmic.playback.unpause();
    })
    
    cosmic.hub.on('planet:collide outOfBounds', function () {
        lose();
    })
    
    cosmic.hub.on('destination:collide', function () {
        win();
    })
    
    /*
    var wait = 0;
    cosmic.hub.on('playback:advance', function () {
        if (wait++ > 10) {
            cosmic.paths.update();
            wait = 0;
        }
    })
    */

    // Start planeteer
    console.log('Starting Planeteer');
    restart();
    cosmic.playback.start(true);

})(cosmic, freebody, Planet, Ship, Destination);
