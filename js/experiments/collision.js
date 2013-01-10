require(
['cosmic', 'freebody', 'cosmic/KineticCamera', 'Planet', 'cosmic/environment'],
function (cosmic, freebody, KineticCamera, Ball, environment) {
    
    // Set up ship and planets
    var ship = [
        new Ball({
            color: 'yellow',
            radius: 20,
            mass: 10,
            //v: new freebody.Vector().x(50),
            v: new freebody.Vector().x(10),
            x: 300,
            y: 90
        }),
        new Ball({
            color: 'orange',
            radius: 25,
            mass: 20,
            v: new freebody.Vector().x(-30),
            x: 450,//3*environment.bounds.width/4,
            y: 110//3*environment.bounds.height/4
        }),
        
        new Ball({
            color: 'orange',
            radius: 25,
            mass: 20,
            v: new freebody.Vector().x(-30),
            x: 450,//3*environment.bounds.width/4,
            y: 410//3*environment.bounds.height/4
        })
    ];
    
    var planets = [
        new Ball({
            color: 'blue',
            radius: 40,
            mass: 100,
            x: 300,
            y: 430
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



















