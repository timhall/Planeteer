define(
['cosmic/Matter', 'cosmic/environment', 'cosmic/ICamera', 'cosmic/collisions'],
function (Matter, environment, ICamera, collisions) {
    var cosmic = {},
        time,
        rAF = window.requestAnimationFrame,
        _paused = false;
    
    // General classes
    cosmic.Matter = Matter;
    cosmic.ICamera = ICamera;
    cosmic.collisions = collisions;
    
    cosmic.environment = environment;   
    
    cosmic.start = function () {
        // Init...
        _paused = false;
        cosmic.progress();
    };
    
    cosmic.progress = function (timestamp) {
        if (!_paused) {
            // Setup next progress
            rAF(cosmic.progress);
            
            // Update physics
            cosmic.environment.advance(timestamp - (time || timestamp));
            
            // Render updated objects
            if (cosmic.beforeRender) { cosmic.beforeRender(); }
            
            if (cosmic.camera) {
                cosmic.camera.render();
            }
            
            // Update time
            time = timestamp;
        }
    };
    
    cosmic.pause = function () {
        _paused = true;
    };
    
    cosmic.step = function () {
        cosmic.start();
        cosmic.pause();
    }
    
    // Finally, return cosmic
    return cosmic;
});