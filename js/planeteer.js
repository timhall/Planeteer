(function (cosmic, freebody, Planet, Ship, Destination) {

    cosmic.environment.bounds.width *= 6;
    cosmic.environment.bounds.height *= 6;
    
    // Set up ship and planets
    var ships = [
        new Ship({
            color: 'yellow',
            radius: 25,
            mass: 1000,
            x: 150,
            y: 150,
            name: 'Fighter'
        })
    ];
    
    var planets = [
        new Planet({
            color: '#6BCAF3',
            radius: 70,
            mass: 10000000000000000 * 8,
            x: 1000,
            y: 2100,
            image: 'blue',
            name: 'Neptune'
        }),
        new Planet({
            color: '#F16122',
            radius: 100,
            mass: 20000000000000000 * 8,
            x: 3100,
            y: 830,
            image: 'orange',
            name: 'Jupiter'
        }),
        new Planet({
            color: 'yellow',
            radius: 250,
            mass: 40000000000000000 * 8,
            x: 2400,
            y: 1800,
            image: 'star',
            name: 'Sun',
            movable: false
        })
    ];
    
    var destinations = [
        new Destination({
            color: null,
            radius: 70,
            x: 2000,
            y: 2800,
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
    
    
    // Setup camera
    var camera = new cosmic.KineticCamera('experiment');
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
    cosmic.hub.on('touchstart', function (e, selection) {
        if (selection && selection.type === 'PlayPauseButton') return;
        cosmic.playback.pause();
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
    
    cosmic.hub.on('planet:collide', function () {
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
    cosmic.playback.start(true);

})(cosmic, freebody, Planet, Ship, Destination);
