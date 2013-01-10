require(
['cosmic', 'freebody', 'cosmic/KineticCamera', 'Planet', 'cosmic/environment'],
function (cosmic, freebody, KineticCamera, Ball, environment) {
    
    // Set up ship and planets
    var ship = [
        new Ball({
            color: 'yellow',
            radius: 10,
            //v: new freebody.Vector().x(50),
            v: new freebody.Vector().y(-30),
            x: 100,
            y: 160
        }),
        new Ball({
            color: 'orange',
            radius: 13,
            mass: 15,
            v: new freebody.Vector().y(30),
            x: 100,//3*environment.bounds.width/4,
            y: 100//3*environment.bounds.height/4
        }),
        new Ball({
            color: 'red',
            radius: 16,
            mass: 20,
            v: new freebody.Vector().y(30),
            x: 200,//3*environment.bounds.width/4,
            y: 150//3*environment.bounds.height/4
        }),
        new Ball({
            color: 'cyan',
            radius: 20,
            mass: 2000,
            v: new freebody.Vector().y(30),
            x: 150,//3*environment.bounds.width/4,
            y: 150//3*environment.bounds.height/4
        })
    ];
    
    var planets = [
        new Ball({
            color: 'blue',
            radius: 40,
            mass: 1000000000000000,
            x: 2*environment.bounds.width/3,
            y: environment.bounds.height/3
        }),
        new Ball({
            color: 'green',
            radius: 50,
            mass: 2000000000000000,
            x: environment.bounds.width/3,
            y: 2*environment.bounds.height/3
        })
    ];
    
    // Add ship and planets
    for (var i = 0; i < ship.length; i++) {
    cosmic.environment.addBody(ship[i]);
    }
    for (var i = 0; i < planets.length; i++) {
    cosmic.environment.addPlanet(planets[i]);
    }
    
    // Setup camera
    var camera = new KineticCamera('experiment');
    
    // Add layers
    camera.layer('foreground', cosmic.environment.objects);
    // camera.layer('background', ...);    
    
    // Set camera in cosmic
    cosmic.camera = camera;
    
    // DEBUG
    window.cosmic = cosmic;
    window.camera = cosmic.camera;
    window.environment = cosmic.environment;
    window.ship = ship;
    window.planets = planets;
    
    // Start experiment:
    console.log('Starting experiment');
    cosmic.start();
});



















