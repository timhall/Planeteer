require(
['cosmic', 'freebody', 'cosmic/KineticCamera', 'Planet.new', 'Ship', 'cosmic/environment'],
function (cosmic, freebody, KineticCamera, Planet, Ship, environment) {
    
    // Set up ship and planets
    var ships = [
        new Ship({
            color: 'yellow',
            radius: 15,
            //v: new freebody.Vector().x(50),
            v: new freebody.Vector().y(-30),
            x: 100,
            y: 160
        }),
        new Ship({
            color: 'orange',
            radius: 18,
            mass: 15,
            v: new freebody.Vector().y(30),
            x: 100,//3*environment.bounds.width/4,
            y: 100//3*environment.bounds.height/4
        }),
        new Ship({
            color: 'red',
            radius: 21,
            mass: 20,
            v: new freebody.Vector().y(30),
            x: 200,//3*environment.bounds.width/4,
            y: 150//3*environment.bounds.height/4
        }),
        new Ship({
            color: 'cyan',
            radius: 25,
            mass: 2000,
            v: new freebody.Vector().y(30),
            x: 150,//3*environment.bounds.width/4,
            y: 150//3*environment.bounds.height/4
        })
    ];
    
    var planets = [
        new Planet({
            color: 'blue',
            radius: 40,
            mass: 1000000000000000,
            x: 2*environment.bounds.width/3,
            y: environment.bounds.height/3,
            image: 'blue'
        }),
        new Planet({
            color: 'green',
            radius: 70,
            mass: 2000000000000000,
            x: environment.bounds.width/3,
            y: 2*environment.bounds.height/3,
            image: 'orange'
        })
    ];
    
    // Add ship and planets
    for (var i = 0; i < ships.length; i++) {
        cosmic.environment.addBody(ships[i]);
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
    
    /*simple.stabilize = function () {
        for (var i = 0; i < ship.length; i++) {
            ship[i].v.magnitude(ship[i].v.magnitude/2);
        }
    }*/
    
    // DEBUG
    window.cosmic = cosmic;
    window.camera = cosmic.camera;
    window.environment = cosmic.environment;
    window.ships = ships;
    window.planets = planets;
    window.fun = function (x) {                        //TEMP FOR CURRENT DEMO because the ships get out of hand
                            for (var i = 0; i < ships.length; i++) {
                                ships[i].v.magnitude(ships[i].v.magnitude()*x);
                            }
                        };
    
    // Start experiment:
    console.log('Starting experiment');
    cosmic.start();
});
