require(
['cosmic', 'freebody', 'cosmic/KineticCamera', 'experiments/Ball'],
function (cosmic, freebody, KineticCamera, Ball) {
    
    // Set up ball
    var ball = new Ball({color: 'yellow'});
    //ball.v = new freebody.Vector().x(20),
    cosmic.environment.addBody(ball);
    
    var planet1 = new Ball({color: 'red'});
    
    planet1.mass = 1000000000000000;
    planet1.x = 500;
    planet1.y = 100;
    cosmic.environment.addPlanet(planet1);
    
    var planet2 = new Ball({color: 'green'});
    cosmic.environment.addPlanet(planet2);
    planet2.mass = 1000000000000000;
    planet2.x = 100;
    planet2.y = 300;
    
   
    
    
    // Add camera
    //window.camera = cosmic.camera = new KineticCamera('experiment');
    var camera = new KineticCamera('experiment');
    camera.layer('foreground', cosmic.environment.objects);
    // camera.layer('background', ...);
    cosmic.camera = camera;
    
    window.ball = ball;
    window.camera = camera;
    
    /*cosmic.beforeRender = function () {
    cosmic.camera.position.x = ball.x - 300;
    cosmic.camera.position.y = ball.y - 200;
    }
    */
    

    // Start experiment:
    cosmic.start();
});



















