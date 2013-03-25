//define(
//['cosmic/Matter', 'cosmic/environment', 'cosmic/CameraBase', 'cosmic/collisions', 'cosmic/gamePiece', 'cosmic/KineticCamera'],
(function (_, Backbone, Matter, environment, CameraBase, collisions, gamePiece, KineticCamera, ui, background) {
    var rAF = window.requestAnimationFrame,
        _paused = false,
        _pausedPhysics = false,
        initStart = false,
        selected = {};
  
    // General classes
    cosmic.Matter = Matter;
    cosmic.CameraBase = CameraBase;
    cosmic.collisions = collisions;
    cosmic.gamePiece = gamePiece;
    cosmic.environment = environment;
    cosmic.ui = ui;
    cosmic.background = background;
    cosmic.iteration = 1;
    

    cosmic.start = function () {
        cosmic.unpause();
        cosmic.progress();
    };
    cosmic.startRendering = function () {
        cosmic.unpause();
        cosmic.pausePhysics();
        cosmic.progress();
    }
  
    cosmic.progress = function (timestamp) {
        if (!_paused) {    
            // Setup next progress
            rAF(cosmic.progress);
              
            if (!_pausedPhysics) {
                //console.log(_paused)
                // Update physics
                cosmic.environment.advance(timestamp - (cosmic.time || timestamp));
            }
              
            // Update time
            cosmic.time = timestamp;
              
            // Render updated objects
            if (cosmic.beforeRender) { cosmic.beforeRender(); }
              
            if (cosmic.camera) {      
                cosmic.camera.render();
            }
        }
    };
    
    cosmic.reset = function () {
        _.each(environment.objects, function (object) {
            object.x = Math.floor(Math.random()*1400 + 100);
            object.y = Math.floor(Math.random()*1200 + 100);
            cosmic.camera.reset();
            cosmic.iteration += 1;
            console.log(cosmic.iteration);
        })
    }
  
    cosmic.pause = function () {
        _paused = true;
    };
    cosmic.pausePhysics = function () {
        _pausedPhysics = true;
    };
    cosmic.unpause = function () {
        _paused = false;
        _pausedPhysics = false;
    }
  
    cosmic.step = function () {
        cosmic.start();
        cosmic.pause();
    };
})(_, Backbone, cosmic.Matter, cosmic.environment, cosmic.CameraBase, cosmic.collisions, cosmic.gamePiece, cosmic.KineticCamera, cosmic.ui, cosmic.background);