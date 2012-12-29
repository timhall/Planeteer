require(
['cosmic', 'underscore', 'freebody', 'cosmic/FabricCamera', 'experiments/Ball'],
function (cosmic, _, freebody, FabricCamera, Ball) {
    
    // Set up cosmic
    var ball = new Ball();
    ball.v = new freebody.Vector().x(20),
    cosmic.environment.addBody(ball);
    
    var planet1 = new Ball();
    
    planet1.mass = 1000000000000000;
    planet1.x = 500;
    planet1.y = 100;
    cosmic.environment.addPlanet(planet1);
    
    var planet2 = new Ball();
    cosmic.environment.addPlanet(planet2);
    planet2.mass = 1000000000000000;
    planet2.x = 100;
    planet2.y = 300;
    
    window.ball = ball;
    window.camera = cosmic.camera = new FabricCamera('experiment'); // Pass in ID of canvas to work with

    var start = function () {
        cosmic.start();
    }
    
    start();  
});



















